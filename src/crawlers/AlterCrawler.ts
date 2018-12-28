import { URL } from "url";
import { HTMLCrawler } from "kw-crawler";
import Crawler from "./Crawler";
import { IFigure } from "../models/figure";
import { md5 } from "../utils/hash";
import { encodeURL } from "../utils/url";

export default class AlterCrawler extends Crawler {
  public async getFiguresURL(): Promise<Array<string>> {
    let figureLinks = [];
    for (let i = 0; i < 2; i++) {
      const year = new Date().getFullYear() + i;
      const url = `https://alter-web.jp/figure/?yy=${year}&mm=`;
      this.url = new URL(url);
      const crawler = new HTMLCrawler(this.url.href);
      crawler.setRule({
        name: "figures_links",
        selector: "figure > a",
        callback: links =>
          links.map(i => this.url.origin + links.eq(i).attr("href")).toArray()
      });
      const results = await crawler.getResults();
      figureLinks = figureLinks.concat(results["figures_links"]);
    }
    return figureLinks;
  }

  public async getFigure(url: string): Promise<IFigure> {
    const crawler = new HTMLCrawler(url);
    crawler.setRule({
      name: "name",
      selector: ".hl06.c-figure",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "series",
      selector: ".cells > div:nth-child(1) > table tr:nth-child(1) > td",
      callback: selector => selector.text().trim()
    });

    crawler.setStatic({
      name: "company",
      value: "Alter"
    });

    crawler.setRule({
      name: "releaseDate",
      selector: ".cells > div:nth-child(1) > table tr:nth-child(2) > td",
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
      selector: ".cells > div:nth-child(1) > table tr:nth-child(2) > td",
      callback: selector => selector.text().indexOf("再販") !== -1
    });

    crawler.setRule({
      name: "price",
      selector: ".cells > div:nth-child(1) > table tr:nth-child(3) > td",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "image",
      selector: ".item-mainimg img",
      callback: selector =>
        encodeURL(new URL(url).origin + selector.attr("src"))
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
