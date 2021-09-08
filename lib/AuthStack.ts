import * as sst from "@serverless-stack/resources";

type AuthStackProps = sst.StackProps;

export default class AuthStack extends sst.Stack {
  public auth: sst.Auth;

  constructor(scope: sst.App, id: string, props?: AuthStackProps) {
    super(scope, id, props);

    this.auth = new sst.Auth(this, "Auth", {
      cognito: {
        userPool: {
          signInAliases: { email: true },
        },
      },
    });

    if (!this.auth.cognitoUserPool) {
      throw new Error("Missing cognito user pool.");
    }
    if (!this.auth.cognitoUserPoolClient) {
      throw new Error("Missing cognito user client.");
    }

    this.addOutputs({
      Region: scope.region,
      UserPoolId: this.auth.cognitoUserPool.userPoolId,
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: this.auth.cognitoUserPoolClient.userPoolClientId,
    });
  }
}
