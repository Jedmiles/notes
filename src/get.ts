import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";
export const main = handler(async (event: APIGatewayProxyEventV2) => {
  if (!event.pathParameters) {
    throw new Error("Missing path parameters.");
  }
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: "123",
      noteId: event.pathParameters.id,
    },
  };
  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }
  return result.Item;
});
