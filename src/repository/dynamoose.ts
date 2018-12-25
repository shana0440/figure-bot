import * as dynamoose from "dynamoose";
import config from "../config";

if (config.app.isOffline) {
  dynamoose.local("http://localhost:8000");
}

export default dynamoose;
