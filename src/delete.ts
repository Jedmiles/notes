import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
  if (!event.pathParameters) {
    throw new Error("Missing path parameters.");
  }
  if (!event.requestContext.authorizer) {
    throw new Error("Missing authorizer");
  }
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      noteId: event.pathParameters.id,
    },
  };
  await dynamoDb.delete(params);
  return { status: true };
});
