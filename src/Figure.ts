import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

// mongoose.connect(`mongodb://${process.env.MONGO_HOST}/figures_bot`);

export class FigureSchema extends Typegoose {
    @prop()
    name: string;        // 產品名稱
    @prop()
    series: string;      // 作品名稱
    @prop()
    company: string;     // 製作商
    @prop()
    release_date: string; // 出貨日期
    @prop()
    is_resale: string;    // 再販
    @prop()
    price: string;       // 價格
    @prop()
    image: string;       // 圖片
    @prop()
    url: string;         // 網址
    @prop({ unique: true })
    md5_url: string;      // hash過的網址，用來當作unique index
}

export const Figure = new FigureSchema().getModelForClass(FigureSchema);