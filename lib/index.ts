import * as sst from "@serverless-stack/resources";
import ApiStack from "./ApiStack";
import StorageStack from "./StorageStack";
import AuthStack from "./AuthStack";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x",
  });

  const storageStack = new StorageStack(app, "storage");
  const auth = new AuthStack(app, "auth");

  new ApiStack(app, "api", {
    table: storageStack.table,
    bucket: storageStack.bucket,
    auth: auth.auth,
  });
}
