import * as sst from "@serverless-stack/resources";
import * as iam from "@aws-cdk/aws-iam";

interface ApiStackProps extends sst.StackProps {
  table: sst.Table;
  auth: sst.Auth;
  bucket: sst.Bucket;
}

export default class ApiStack extends sst.Stack {
  public api: sst.Api;

  constructor(scope: sst.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { table, auth, bucket } = props;

    this.api = new sst.Api(this, "Api", {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        "POST /notes": "src/create.main",
        "GET  /notes/{id}": "src/get.main",
        "GET  /notes": "src/list.main",
        "PUT  /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
      },
    });

    this.api.attachPermissions([table]);
    auth.attachPermissionsForAuthUsers([
      this.api,
      new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: [
          bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        ],
      }),
    ]);

    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
