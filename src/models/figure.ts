export interface IFigure {
  // md5 hash過的網址，用來當作primary index
  id: string;
  // 產品名稱
  name: string;
  // 作品名稱
  series: string;
  // 製作商
  company: string;
  // 出貨日期
  releaseDate: Date;
  // 再販
  isResale: boolean;
  // 價格ean;
  price: string;
  // 圖片
  image: string;
  // 網址;
  url: string;
}
