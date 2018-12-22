import "mocha";
import { expect } from "chai";
import PulchraCrawler from "../crawlers/PulchraCrawler";

describe("parse pulchra figures", () => {
  it("parse figure list", async () => {
    const crawler = new PulchraCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "https://pulc.jp/category/select/cid/312/pid/8938"
    );
  }).timeout(10000);

  it("parse figure", async () => {
    const crawler = new PulchraCrawler();
    const figure = await crawler.getFigure(
      "https://pulc.jp/category/select/cid/312/pid/8938"
    );
    expect(figure).to.deep.equal({
      name: "鳶一折紙",
      series: "デート・ア・ライブ",
      releaseDate: new Date("2019-05-31T16:00:00.000Z"),
      isResale: false,
      price: "14,904円",
      image:
        "https://pulc.jp/resources/upload/products/thumbnail2/20181220_origami hannnugi_shop_shiro.jpg",
      company: "PULCHRA",
      url: "https://pulc.jp/category/select/cid/312/pid/8938",
      id: "7a1ab2f0bc5f2ddb870b4d184a31c386"
    });
  }).timeout(10000);
});
