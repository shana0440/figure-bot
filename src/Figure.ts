import * as mongoose from 'mongoose';

const mongoConnString = `mongodb://${process.env.MONGO_HOST}:27017/figures_bot`;
mongoose.connect(mongoConnString);

export interface IFigure {
    name:         string,  // 產品名稱
    series:       string,  // 作品名稱
    company:      string,  // 製作商
    release_date: Date,    // 出貨日期
    is_resale:    boolean, // 再販
    price:        string,  // 價格
    image:        string,  // 圖片
    url:          string,  // 網址
    md5_url:      string,  // hash過的網址，用來當作unique index
}

const FigureSchema = new mongoose.Schema({
    name:         String,  // 產品名稱
    series:       String,  // 作品名稱
    company:      String,  // 製作商
    release_date: Date,    // 出貨日期
    is_resale:    Boolean, // 再販
    price:        String,  // 價格
    image:        String,  // 圖片
    url:          String,  // 網址
    md5_url:      String,  // hash過的網址，用來當作unique index
})

export const Figure = mongoose.model('Figure', FigureSchema);