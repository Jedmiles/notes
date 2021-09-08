import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
  if (!event.pathParameters) {
    throw new Error("Missing path parameters.");
  }
  if (!event.requestContext.authorizer) {
    throw new Error("Missing authorizer")
  }
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: event.pathParameters.id,
    },
  };
  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }
  return result.Item;
});
