import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../models/figure";
import { URL } from "url";
import { md5 } from "../utils/hash";

export default class AlphamaxCrawler extends Crawler {
  public async getFiguresURL(): Promise<string[]> {
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
      name: "releaseDate",
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
      name: "isResale",
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
      callback: selector => new URL(url).origin + selector.attr("src")
    });

    crawler.setStatic({
      name: "url",
      value: url
    });

    crawler.setStatic({
      name: "id",
      value: md5(url)
    });

    const figure = await crawler.getResults({ args: ["--no-sandbox"] });
    return figure;
  }
}
