import * as uuid from "uuid";

import { APIGatewayProxyEventV2 } from "aws-lambda";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  if (!event.body) {
    throw new Error("Missing event body.");
  }
  const data: NoteData = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: "123",
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };
  await dynamoDb.put(params);
  return params.Item;
});
