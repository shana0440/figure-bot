import { GoodSmileCrawler } from "./crawlers/GoodSmileCrawler";

const year = new Date().getFullYear();
const url = `http://www.goodsmile.info/zh/products/category/scale/announced/${year}`;
let crawler = new GoodSmileCrawler(url);

crawler.getFigures();