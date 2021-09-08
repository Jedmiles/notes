import { APIGatewayProxyHandler } from "aws-lambda";

export default function handler(lambda: LambdaFn): APIGatewayProxyHandler {
  return async (event, context) => {
    let body;
    let statusCode: number;
    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      if (e instanceof Error) {
        body = { error: e.message };
      }
      statusCode = 500;
    }
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        },
    };
  };
}
