import { URL } from "url";
import { HTMLCrawler } from "kw-crawler";
import Crawler from "./Crawler";
import { IFigure } from "../models/figure";
import { md5 } from "../utils/hash";
import { encodeURL } from "../utils/url";

export default class FnexCrawler extends Crawler {
  public async getFiguresURL(): Promise<Array<string>> {
    const url = `https://fnex.jp/products/search.php?categories%5B%5D=14`;
    this.url = new URL(url);

    const crawler = new HTMLCrawler(this.url.href, { usePuppeteer: true });
    crawler.setRule({
      name: "figures_links",
      selector: ".item",
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
      selector: ".name",
      callback: selector =>
        selector
          .text()
          .replace(/[^\s]+\s/, "")
          .trim()
    });

    crawler.setRule({
      name: "series",
      selector: ".name",
      callback: selector =>
        selector
          .text()
          .match(/([^\s]+)/)
          .shift()
    });

    crawler.setStatic({
      name: "company",
      value: "F:NEX"
    });

    crawler.setRule({
      name: "releaseDate",
      selector: "#form1 > section:nth-child(6) > div > h4",
      callback: selector => {
        const date = new Date(
          selector
            .text()
            .trim()
            .substr(0, 7)
            .replace(/年|月/g, "/")
        );
        return isNaN(date.getTime()) ? new Date("1970/01/01") : date;
      }
    });

    // no resale information yet
    crawler.setStatic({
      name: "isResale",
      value: false
    });

    crawler.setRule({
      name: "price",
      selector:
        "#form1 > section.pdetail_slider.in-wrap > div.text > div.price > p.num",
      callback: selector => selector.text().replace(/\s/g, "")
    });

    crawler.setRule({
      name: "image",
      selector: "#tlarge > div.active > img",
      callback: selector => encodeURL(selector.attr("src"))
    });

    crawler.setStatic({
      name: "url",
      value: url
    });

    crawler.setStatic({
      name: "id",
      value: md5(url)
    });

    const figure = await crawler.getResults();
    return figure;
  }
}
