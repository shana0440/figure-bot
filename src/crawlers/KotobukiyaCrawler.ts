import { URL } from "url";
import { HTMLCrawler } from "kw-crawler";
import { md5 } from "../utils/hash";
import Crawler from "./Crawler";
import { IFigure } from "../models/figure";

export default class KotobukiyaCrawler extends Crawler {
  resaleList: { [key: string]: string } = {};

  public async getFiguresURL(): Promise<Array<string>> {
    const url = `https://www.kotobukiya.co.jp/product-category/figure/`;
    this.url = new URL(url);
    const crawler = new HTMLCrawler(this.url.href);
    crawler.setRule({
      name: "figures_links",
      selector: ".product-item",
      callback: links => {
        links = links
          .map(i => ({
            href: this.url.origin + links.eq(i).attr("href"),
            resale: links.eq(i).find(".reproduct").length > 0
          }))
          .toArray();
        links.forEach(link => {
          this.resaleList[link.href] = link.resale;
        });
        return links.map(link => link.href);
      }
    });
    const results = await crawler.getResults({ args: ["--no-sandbox"] });
    return results["figures_links"];
  }

  public async getFigure(url: string): Promise<IFigure> {
    const crawler = new HTMLCrawler(url);
    crawler.setRule({
      name: "name",
      selector: ".product-title h1",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "series",
      selector: ".product-data dl dd:nth-child(2)",
      callback: selector => selector.text().trim()
    });

    crawler.setStatic({
      name: "company",
      value: "壽屋"
    });

    crawler.setRule({
      name: "releaseDate",
      selector: ".product-data dl dd:nth-child(6)",
      callback: selector =>
        new Date(
          selector
            .text()
            .trim()
            .replace(/年|月/g, "/")
        )
    });

    crawler.setStatic({
      name: "isResale",
      value: this.resaleList[url]
    });

    crawler.setRule({
      name: "price",
      selector: ".product-data dl dd:nth-child(12)",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "image",
      selector: ".product-main img",
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
