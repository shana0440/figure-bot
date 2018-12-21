import * as AWS from "aws-sdk";
import * as request from "request";
import { md5 } from "./utils/hash";
import { PassThrough } from "stream";
import { IFigure } from "./Figure";
import config from "./config";

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});
const bucket = `figures_${config.app.env}`;
const s3 = new AWS.S3();

export const uploadFiguresImage = async (
  figures: IFigure[]
): Promise<IFigure[]> => {
  for (const figure of figures) {
    try {
      figure.image = await uploadByURL(figure.image);
    } catch (err) {
      // TODO: handle error
      console.log("this figure cant upload image: ", figure);
    }
  }
  return figures;
};

export const uploadByURL = (url: string): Promise<string> => {
  const extension = url.split(".").pop();
  const filename = `${md5(url)}.${extension}`;
  const pass = new PassThrough();
  const params = {
    Bucket: bucket,
    Key: filename,
    Body: pass,
    ACL: "public-read"
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      // TODO: handle error
      console.log(err, data);
    }).send((err, data) => {
      // TODO: handle error
      resolve(`${config.aws.s3WebURL}/${bucket}/${filename}`);
    });

    request(url).pipe(pass);
  });
};
