import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
export const main = handler(async (event) => {
  if (!event.requestContext.authorizer) {
    throw new Error("Missing authorizer")
  }
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };
  const result = await dynamoDb.query(params);
  return result.Items;
});
