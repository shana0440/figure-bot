import * as AWS from "aws-sdk";
import * as tar from "tar";
import config from "../config";

const chromePath = "/tmp/headless_shell";

export const setupChrome = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3();
    s3.getObject({
      Bucket: config.aws.bucket,
      Key: "headless_shell.tar.gz"
    })
      .createReadStream()
      .pipe(
        tar.x({
          C: "/tmp/"
        })
      )
      .on("end", () => {
        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });
};

export const puppeteerOptions = config.app.isOffline
  ? {
      args: ["--no-sandbox"]
    }
  : {
      executablePath: chromePath,
      args: ["--no-sandbox"]
    };
