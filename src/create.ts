import * as uuid from "uuid";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
  if (!event.body) {
    throw new Error("Missing event body.");
  }
  if (!event.requestContext.authorizer) {
    throw new Error("Missing authorizer.")
  }
  const data: NoteData = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };
  await dynamoDb.put(params);
  return params.Item;
});
