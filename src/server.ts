import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from "aws-lambda";
import { WebhookRequestBody } from "@line/bot-sdk";
import { handleEvent } from "./Bot";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const request: WebhookRequestBody = JSON.parse(event.body);
  try {
    await Promise.all(request.events.map(handleEvent));
    return {
      statusCode: 200,
      body: ""
    };
  } catch (err) {
    // handler error
    return {
      statusCode: 500,
      body: ""
    };
  }
};
