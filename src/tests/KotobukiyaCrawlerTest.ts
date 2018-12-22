import "mocha";
import { expect } from "chai";
import KotobukiyaCrawler from "../crawlers/KotobukiyaCrawler";

describe("parse kotobukiya figures", () => {
  it("parse figure list", async () => {
    const crawler = new KotobukiyaCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "https://www.kotobukiya.co.jp/product/product-0000001552/"
    );
  }).timeout(10000);

  it("parse figure", async () => {
    const crawler = new KotobukiyaCrawler();
    const figure = await crawler.getFigure(
      "https://www.kotobukiya.co.jp/product/product-0000001552/"
    );
    expect(figure).to.deep.equal({
      name: "時崎狂三",
      series: "デート・ア・ライブⅡ",
      releaseDate: new Date("2019-04-30T16:00:00.000Z"),
      price: "8,200円（税抜）",
      image:
        "https://www.kotobukiya.co.jp/wp-content/uploads/2014/12/kurumi_web.jpg",
      company: "壽屋",
      isResale: undefined,
      url: "https://www.kotobukiya.co.jp/product/product-0000001552/",
      id: "87389ee9ca831865cb63323c325dcf0f"
    });
  }).timeout(10000);
});
