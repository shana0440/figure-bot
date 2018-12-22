import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../models/figure";
import { createHash } from "crypto";
import { URL } from "url";

export class AoshimaCrawler extends Crawler {
  public async getFiguresURL(): Promise<Array<string>> {
    const url = `http://www.aoshima-bk.co.jp/product/?s=&brand=&category=%E3%83%95%E3%82%A3%E3%82%AE%E3%83%A5%E3%82%A2`;
    this.url = new URL(url);
    const crawler = new HTMLCrawler(this.url.href);
    crawler.setRule({
      name: "figures_links",
      selector: "ul li > p:nth-child(2) > a",
      callback: links => links.map(i => links.eq(i).attr("href")).toArray()
    });
    const results = await crawler.getResults({ args: ["--no-sandbox"] });
    return results["figures_links"];
  }

  public async getFigure(url: string): Promise<IFigure> {
    const crawler = new HTMLCrawler(url);
    crawler.setRule({
      name: "name",
      selector: "h1",
      callback: selector =>
        selector
          .text()
          .split(" ")
          .slice(2, 4)
          .join(" ")
    });

    crawler.setRule({
      name: "series",
      selector: "h1",
      callback: selector => selector.text().split(" ")[0]
    });

    crawler.setStatic({
      name: "company",
      value: "Aoshima"
    });

    crawler.setRule({
      name: "release_date",
      selector: "div.itemData.clearfix > dl > dd:nth-child(8)",
      callback: selector =>
        new Date(
          selector
            .text()
            .trim()
            .substr(0, 7)
            .replace(/[年|月]/g, "/")
        )
    });

    crawler.setRule({
      name: "is_resale",
      selector: "h1",
      callback: selector => selector.text().indexOf("再生產") !== -1
    });

    crawler.setRule({
      name: "price",
      selector: ".itemData.clearfix > dl > dd:nth-child(10)",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "image",
      selector: ".img > img",
      callback: selector => selector.attr("src")
    });

    crawler.setStatic({
      name: "url",
      value: url
    });

    crawler.setStatic({
      name: "md5_url",
      value: createHash("md5")
        .update(url)
        .digest("hex")
    });

    const figure = await crawler.getResults({ args: ["--no-sandbox"] });
    return figure;
  }
}
