import AlterCrawler from "../crawlers/AlterCrawler";
import "mocha";
import { expect } from "chai";

describe("parse alter figures", () => {
  it("parse figure list", async () => {
    const crawler = new AlterCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include("https://alter-web.jp/products/189/");
  }).timeout(50000);

  it("parse figure", async () => {
    const crawler = new AlterCrawler();
    const figure = await crawler.getFigure(
      "https://alter-web.jp/products/189/"
    );
    expect(figure).to.deep.equal({
      name: "ライダー／アルトリア・ペンドラゴン［サンタオルタ］",
      series: "Fate/Grand Order",
      release_date: new Date("2018-01-31T16:00:00.000Z"),
      is_resale: false,
      price: "13,800円+税",
      image:
        "https://alter-web.jp/uploads/products/20170315134156_a7MDZrfC.jpg",
      company: "Alter",
      url: "https://alter-web.jp/products/189/",
      id: "1e71d1741f7eabc037c3eefe9c505286"
    });
  }).timeout(50000);
});
