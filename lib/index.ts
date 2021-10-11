import * as sst from "@serverless-stack/resources";
import ApiStack from "./ApiStack";
import StorageStack from "./StorageStack";
import AuthStack from "./AuthStack";
import FrontendStack from "./FrontendStack";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x",
  });

  const storageStack = new StorageStack(app, "storage");
  const authStack = new AuthStack(app, "auth");
  const apiStack = new ApiStack(app, "api", {
    table: storageStack.table,
    bucket: storageStack.bucket,
    auth: authStack.auth,
  });

  new FrontendStack(app, "frontend", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: storageStack.bucket,
  })
}
