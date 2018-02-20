import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { Model, Document } from 'mongoose';

const mongoConnString = `mongodb://${process.env.MONGO_HOST}:27017/figures_bot`;
mongoose.connect(mongoConnString);

export interface IFigure extends Document {
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
    md5_url: {             // hash過的網址，用來當作unique index
        type: String,
        unique: true,
    }
})

const FigureString = 'Figure';

FigureSchema.statics.notInDB = async function(figures: Array<IFigure>): Promise<Array<IFigure>> {
    const results = await (<mongoose.Model<any>>this.model(FigureString))
        .where('md5_url').in(figures.map(f => f.md5_url))
        .exec();

    return _.differenceBy(
        figures,
        results,
        (f1: IFigure, f2: IFigure) => f1.md5_url == (f2 && f2.md5_url || '')
    );
}

interface IFigureModel extends Model<IFigure> {
    notInDB(figures: Array<IFigure>): Promise<Array<IFigure>>;
}

export const Figure: IFigureModel = mongoose.model<IFigure, IFigureModel>(FigureString, FigureSchema);