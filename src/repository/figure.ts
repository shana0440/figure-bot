import * as _ from "lodash";
import dynamoose from "./dynamoose";
import { IFigure } from "../models/figure";
import config from "../config";
import { md5 } from "../utils/hash";

const FiguresSchema = new dynamoose.Schema({
  // md5 hash過的網址，用來當作primary index
  id: { type: String, hashKey: true, required: true },
  // 產品名稱
  name: { type: String, required: true },
  // 作品名稱
  series: { type: String, required: false },
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

interface FiguresKeySchema {
  id: string;
}

const Figure = dynamoose.model<IFigure, FiguresKeySchema>(
  `figures_${config.app.env}`,
  FiguresSchema
);

export const leaveUnsavedURL = async (urls: string[]): Promise<string[]> => {
  const md5URL = urls.map(md5);
  const saved = await Figure.batchGet(md5URL.map(id => ({ id })));
  return _.differenceWith<string, IFigure>(
    urls,
    saved,
    (url: string, figure: IFigure) => url === figure.url
  );
};

export const saveFigures = async (figures: IFigure[]): Promise<void> => {
  // TODO: validate the data in better place
  await Figure.batchPut(
    figures.filter(figure => {
      if (figure.name === "") {
        console.log("this figure have some error", figure);
      }
      return figure.name !== "";
    })
  );
};
