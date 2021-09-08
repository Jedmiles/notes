import * as sst from "@serverless-stack/resources";
import { HttpMethods } from "@aws-cdk/aws-s3";

export default class StorageStack extends sst.Stack {
  table: sst.Table;
  bucket: sst.Bucket;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.bucket = new sst.Bucket(this, "Uploads", {
      s3Bucket: {
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: [
              HttpMethods.GET,
              HttpMethods.PUT,
              HttpMethods.POST,
              HttpMethods.DELETE,
              HttpMethods.HEAD,
            ],
          },
        ],
      },
    });

    this.table = new sst.Table(this, "Notes", {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
    });
  }
}
