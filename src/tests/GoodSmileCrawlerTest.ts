import GoodSmileCrawler from "../crawlers/GoodSmileCrawler";
import "mocha";
import { expect } from "chai";

describe("parse goodsmile figures", () => {
  it("parse figure list", async () => {
    const crawler = new GoodSmileCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "http://www.goodsmile.info/zh/product/3217/Caster+Fate+EXTRA.html"
    );
  }).timeout(10000);

  it("parse figure", async () => {
    const crawler = new GoodSmileCrawler();
    const figure = await crawler.getFigure(
      "https://www.goodsmile.info/zh/product/3217/Caster+Fate+EXTRA.html"
    );
    expect(figure).to.deep.equal({
      name: "Caster [Fate/EXTRA]",
      series: "Fate/EXTRA",
      company: "Phat!",
      releaseDate: new Date("2019-06-30T16:00:00.000Z"),
      isResale: false,
      price: "11,000日圓+消費稅",
      image:
        "https://images.goodsmile.info/cgm/images/product/20110711/3217/14586/large/ef03642293da5e567fb1a8585c56fa39.jpg",
      url: "https://www.goodsmile.info/zh/product/3217/Caster+Fate+EXTRA.html",
      id: "038812da8253ee35a5288aa0453db514"
    });
  }).timeout(10000);
});
