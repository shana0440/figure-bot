import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../Figure";
import { createHash } from "crypto";
import { URL } from "url";

export class KotobukiyaCrawler extends Crawler {
  resaleList: { [key: string]: string } = {};

  protected async parseFigureListPage(): Promise<Array<string>> {
    const url = `https://www.kotobukiya.co.jp/product-series/pvc塗装済み完成品フィギュア/`;
    this.url = new URL(url);
    const crawler = new HTMLCrawler(this.url.href);
    crawler.setRule({
      name: "figures_links",
      selector: ".item-bordered",
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

  protected async parseFigurePage(url: string): Promise<IFigure> {
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
      name: "release_date",
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
      name: "is_resale",
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
