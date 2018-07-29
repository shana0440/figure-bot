import * as AWS from 'aws-sdk';
import * as request from 'request';
import { createHash } from 'crypto';
import { PassThrough } from 'stream';
import { IFigure } from './Figure';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

export const uploadFiguresImage = async (figures: IFigure[]): Promise<IFigure[]> => {
    for (let figure of figures) {
        try {
            figure.image = await uploadByURL(figure.image);
        } catch (err) {
            console.log('this figure cant upload image: ', figure);
        }
    }
    return figures;
}

export const uploadByURL = (url: string): Promise<string> => {
    const filename = createHash('md5').update(url).digest('hex') + '.' + url.split('.').pop();
    const pass = new PassThrough();
    const s3 = new AWS.S3();

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filename,
        Body: pass,
        ACL: 'public-read',
    }
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            console.log(err, data);
        })
        .send((err, data) => {
            resolve(`${process.env.AWS_S3_HOST}/${process.env.AWS_S3_BUCKET}/${filename}`);
        });

        request(url)
            .pipe(pass);
    })
}