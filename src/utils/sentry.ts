import * as Sentry from "@sentry/node";
import { Handler } from "aws-lambda";
import config from "../config";

Sentry.init({ dsn: config.sentry.dsn });

export default Sentry;

export const sentryLambdaWrapper = (handler: Handler): Handler => {
  return async (...args) => {
    try {
      return await handler.apply(null, args);
    } catch (err) {
      await Sentry.getCurrentHub()
        .getClient()
        .captureException(err);
      throw err;
    }
  };
};
