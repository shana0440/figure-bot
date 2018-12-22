import GoodSmileCrawler from "../crawlers/GoodSmileCrawler";
import "mocha";
import { expect, assert } from "chai";

describe("parse goodsmile figures", () => {
  it("parse", async () => {
    const crawler = new GoodSmileCrawler();
    const figure = await crawler.getFigure(
      "https://www.goodsmile.info/zh/product/3217/Caster+Fate+EXTRA.html"
    );
    // assert.equal
    expect(figure).to.deep.equal({
      name: "Caster [Fate/EXTRA]",
      series: "Fate/EXTRA",
      company: "Phat!",
      release_date: new Date("2019-06-30T16:00:00.000Z"),
      is_resale: false,
      price: "11,000日圓+消費稅",
      image:
        "https://images.goodsmile.info/cgm/images/product/20110711/3217/14586/large/ef03642293da5e567fb1a8585c56fa39.jpg",
      url: "https://www.goodsmile.info/zh/product/3217/Caster+Fate+EXTRA.html",
      id: "038812da8253ee35a5288aa0453db514"
    });
  }).timeout(10000);
});
