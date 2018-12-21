import * as dynamoose from "dynamoose";
import config from "../config";

if (config.app.isOffline) {
  dynamoose.local("http://localhost:8000");
} else {
  dynamoose.AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
  });
}

export default dynamoose;
