import * as AWS from "aws-sdk";

import { PromiseResult } from "aws-sdk/lib/request";
const client = new AWS.DynamoDB.DocumentClient();

export default {
  get: (
    params: AWS.DynamoDB.DocumentClient.GetItemInput
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>
  > => client.get(params).promise(),
  put: (
    params: AWS.DynamoDB.DocumentClient.PutItemInput
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
  > => client.put(params).promise(),
  query: (
    params: AWS.DynamoDB.DocumentClient.QueryInput
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.QueryOutput, AWS.AWSError>
  > => client.query(params).promise(),
  update: (
    params: AWS.DynamoDB.DocumentClient.UpdateItemInput
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.UpdateItemOutput, AWS.AWSError>
  > => client.update(params).promise(),
  delete: (
    params: AWS.DynamoDB.DocumentClient.DeleteItemInput
  ): Promise<
    PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>
  > => client.delete(params).promise(),
};
