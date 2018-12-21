import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../Figure";
import { createHash } from "crypto";
import { URL } from "url";

export class AlterCrawler extends Crawler {
  protected async parseFigureListPage(): Promise<Array<string>> {
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
      const results = await crawler.getResults({ args: ["--no-sandbox"] });
      figureLinks = figureLinks.concat(results["figures_links"]);
    }
    return figureLinks;
  }

  protected async parseFigurePage(url: string): Promise<IFigure> {
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
      name: "release_date",
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
      name: "is_resale",
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
