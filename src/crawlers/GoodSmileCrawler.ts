import { HTMLCrawler } from "kw-crawler";
import { Crawler } from "./Crawler";
import { IFigure } from "../models/figure";
import { URL } from "url";
import { md5 } from "../utils/hash";

export default class GoodSmileCrawler extends Crawler {
  public async getFiguresURL(): Promise<string[]> {
    const year = new Date().getFullYear();
    const url = `https://www.goodsmile.info/zh/products/category/scale/announced/${year}`;
    this.url = new URL(url);

    const crawler = new HTMLCrawler(this.url.href);
    crawler.setRule({
      name: "figures_links",
      selector: ".hitBox > a",
      callback: links => links.map(i => links.eq(i).attr("href")).toArray()
    });
    const results = await crawler.getResults({ args: ["--no-sandbox"] });
    return results["figures_links"];
  }

  public async getFigure(url: string): Promise<IFigure> {
    const crawler = new HTMLCrawler(url);

    crawler.setCookie({
      name: "age_verification_ok",
      value: "true",
      domain: "www.goodsmile.info"
    });

    crawler.setRule({
      name: "name",
      selector: "#itemBox > div.itemInfo > h1",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "series",
      selector: ".detailBox dd:nth-child(4)",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "company",
      selector: ".detailBox dd:nth-child(6)",
      callback: selector => selector.text().trim()
    });

    crawler.setRule({
      name: "releaseDate",
      selector: ".detailBox dd.release_date",
      callback: selector => new Date(selector.text().trim())
    });

    crawler.setRule({
      name: "isResale",
      selector: ".detailBox dd:nth-child(16)",
      callback: selector => selector.length === 1
    });

    crawler.setRule({
      name: "price",
      selector: ".detailBox div > dd",
      callback: selector => selector.text().replace(/\s/g, "")
    });

    crawler.setRule({
      name: "image",
      selector: "#itemZoom1 img.itemImg",
      callback: selector => new URL(url).protocol + selector.attr("src")
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
