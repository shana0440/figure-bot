import "mocha";
import { expect } from "chai";
import AoshimaCrawler from "../crawlers/AoshimaCrawler";

describe("parse aoshima figures", () => {
  it("parse figure list", async () => {
    const crawler = new AoshimaCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "http://www.aoshima-bk.co.jp/product/4905083099551/"
    );
  }).timeout(10000);

  it("parse figure", async () => {
    const crawler = new AoshimaCrawler();
    const figure = await crawler.getFigure(
      "http://www.aoshima-bk.co.jp/product/4905083099551/"
    );
    expect(figure).to.deep.equal({
      name: "玉藻の前 サマー・ヴァカンスver.",
      series: "Fate/EXTELLA",
      releaseDate: new Date("2018-04-30T16:00:00.000Z"),
      isResale: false,
      price: "12,800円（税別）",
      image:
        "https://www.aoshima-bk.co.jp/wp/wp-content/uploads/2018/01/4905083099551_pkg-500x480.jpg",
      company: "Aoshima",
      url: "http://www.aoshima-bk.co.jp/product/4905083099551/",
      md5_url: "d6b63f4c89e6376fbdc3149d571e7b0d"
    });
  }).timeout(10000);
});
