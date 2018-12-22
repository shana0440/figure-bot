import AlphamaxCrawler from "../crawlers/AlphamaxCrawler";
import "mocha";
import { expect } from "chai";

describe("parse alphamax figures", () => {
  it("parse figure list", async () => {
    const crawler = new AlphamaxCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "http://alphamax.jp/ja-JP/Products/detail/ax0161kurisu"
    );
  }).timeout(30000);

  it("parse figure", async () => {
    const crawler = new AlphamaxCrawler();
    const figure = await crawler.getFigure(
      "http://alphamax.jp/ja-JP/Products/detail/ax0161kurisu"
    );
    expect(figure).to.deep.equal({
      name: "牧瀬紅莉栖",
      series: "STEINS;GATE",
      company: "Alphamax",
      releaseDate: new Date("2018-07-31T16:00:00.000Z"),
      isResale: false,
      price: "13,800円（税抜）",
      image: "http://alphamax.jp/files/IMG_1621_0.jpg",
      url: "http://alphamax.jp/ja-JP/Products/detail/ax0161kurisu",
      id: "a6e86fd8879a4e21a606db3d079fec37"
    });
  }).timeout(30000);
});
