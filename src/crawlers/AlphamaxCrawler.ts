import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../models/figure";
import { createHash } from "crypto";
import { URL } from "url";

export class AlphamaxCrawler extends Crawler {
  public async getFiguresURL(): Promise<Array<string>> {
    const url = `http://alphamax.jp/ja-JP/Categories/index/figure`;
    this.url = new URL(url);
    const crawler = new HTMLCrawler(this.url.href);
    crawler.setRule({
      name: "figures_links",
      selector: ".product-list .product-link",
      callback: links =>
        links.map(i => this.url.origin + links.eq(i).attr("href")).toArray()
    });
    const results = await crawler.getResults({ args: ["--no-sandbox"] });
    return results["figures_links"];
  }

  public async getFigure(url: string): Promise<IFigure> {
    const crawler = new HTMLCrawler(url);
    crawler.setRule({
      name: "name",
      selector: "h1",
      callback: selector => selector.text()
    });

    crawler.setRule({
      name: "series",
      selector: ".product-detail h3",
      callback: selector => selector.text()
    });

    crawler.setStatic({
      name: "company",
      value: "Alphamax"
    });

    crawler.setRule({
      name: "release_date",
      selector: ".info-container > table tr:nth-child(6) > td:nth-child(2)",
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
      selector: ".info-container > table tr:nth-child(6) > td:nth-child(2)",
      callback: selector => selector.text().indexOf("再販") !== -1
    });

    crawler.setRule({
      name: "price",
      selector: ".info-container > table tr:nth-child(5) > td:nth-child(2)",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "image",
      selector: ".main-image > img",
      callback: selector => this.url.origin + selector.attr("src")
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
