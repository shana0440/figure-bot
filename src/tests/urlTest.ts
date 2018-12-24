import "mocha";
import { expect } from "chai";
import { encodeURL } from "../utils/url";

describe("test url util", () => {
  it("encodeURL should encode invalid url", () => {
    const url = encodeURL(
      "https://pulc.jp/resources/upload/products/thumbnail2/20181220_origami hannnugi_shop_shiro.jpg"
    );
    expect(url).to.be.equal(
      "https://pulc.jp/resources/upload/products/thumbnail2/20181220_origami%20hannnugi_shop_shiro.jpg"
    );
  });

  it("encodeURL should not encode valid url", () => {
    const url = encodeURL(
      "https://pulc.jp/resources/upload/products/thumbnail2/20181220_origami_hannnugi_shop_shiro.jpg"
    );
    expect(url).to.be.equal(
      "https://pulc.jp/resources/upload/products/thumbnail2/20181220_origami_hannnugi_shop_shiro.jpg"
    );
  });
});
