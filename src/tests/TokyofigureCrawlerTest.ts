import TokyofigureCrawler from "../crawlers/TokyofigureCrawler";
import "mocha";
import { expect } from "chai";

describe("parse tokyofigure figures", () => {
  it("parse figure list", async () => {
    const crawler = new TokyofigureCrawler();
    const urls = await crawler.getFiguresURL();
    expect(urls).to.deep.include(
      "https://tokyofigure.jp/products/detail.php?product_id=57"
    );
  }).timeout(10000);

  it("parse figure", async () => {
    const crawler = new TokyofigureCrawler();
    const figure = await crawler.getFigure(
      "https://tokyofigure.jp/products/detail.php?product_id=57"
    );
    expect(figure).to.deep.equal({
      name: "セイバー TYPE-MOON RACING Ver.",
      series: "Fate/stay night",
      company: "株式会社プラスワン",
      releaseDate: new Date("2019-01-31T16:00:00.000Z"),
      price: "12,800円",
      image:
        "https://tokyofigure.jp/upload/save_image/07280640_5b5b91387a95e.jpg",
      isResale: false,
      url: "https://tokyofigure.jp/products/detail.php?product_id=57",
      id: "18aac1cef07dfee8229b022fcc11e9d8"
    });
  }).timeout(10000);
});
