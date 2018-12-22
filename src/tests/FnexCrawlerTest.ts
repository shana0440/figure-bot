import FnexCrawler from "../crawlers/FnexCrawler";
import "mocha";
import { expect } from "chai";

describe("parse fnex figures", () => {
  it("parse figure list", async () => {
    const crawler = new FnexCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "https://fnex.jp/products/detail.php?product_id=6"
    );
  }).timeout(50000);

  it("parse figure", async () => {
    const crawler = new FnexCrawler();
    const figure = await crawler.getFigure(
      "https://fnex.jp/products/detail.php?product_id=6"
    );
    expect(figure).to.deep.equal({
      name: "2017」Ver. 1/7スケールフィギュア",
      series: "初音ミク「マジカルミライ",
      releaseDate: new Date("2018-01-31T16:00:00.000Z"),
      price: "¥15,800（税抜）",
      image:
        "https://df73htivstjso.cloudfront.net/upload/save_image/09052201_59aea022e701d.jpg",
      company: "F:NEX",
      isResale: false,
      url: "https://fnex.jp/products/detail.php?product_id=6",
      id: "5a1bb5720230722cbab5e1fbbcfc3d17"
    });
  }).timeout(50000);
});
