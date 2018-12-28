import AlphamaxCrawler from "../crawlers/AlphamaxCrawler";
import "mocha";
import { expect } from "chai";

describe("parse alphamax figures", () => {
  it("parse figure list", async () => {
    const crawler = new AlphamaxCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "https://alphamax.jp/ja-JP/Products/detail/ax0161kurisu"
    );
  }).timeout(30000);

  it("parse figure", async () => {
    const crawler = new AlphamaxCrawler();
    const figure = await crawler.getFigure(
      "https://alphamax.jp/ja-JP/Products/detail/ax0161kurisu"
    );
    expect(figure).to.deep.equal({
      name: "牧瀬紅莉栖",
      series: "STEINS;GATE",
      company: "Alphamax",
      releaseDate: new Date("2018-07-31T16:00:00.000Z"),
      isResale: false,
      price: "13,800円（税抜）",
      image: "https://alphamax.jp/files/IMG_1621_0.jpg",
      url: "https://alphamax.jp/ja-JP/Products/detail/ax0161kurisu",
      id: "30f1cdcd0733935921f10369c64664dc"
    });
  }).timeout(30000);
});
