import dynamoose from "./dynamoose";

const FiguresSchema = new dynamoose.Schema({
  // md5 hash過的網址，用來當作primary index
  id: { type: String, hashKey: true, required: true },
  // 產品名稱
  name: { type: String, required: true },
  // 作品名稱
  series: { type: String, required: true },
  // 製作商
  company: { type: String, required: true },
  // 出貨日期
  releaseDate: { type: Date, required: true },
  // 再販
  isResale: { type: Boolean, required: true },
  // 價格
  price: { type: String, required: true },
  // 圖片
  image: { type: String, required: true },
  // 網址
  url: { type: String, required: true }
});
