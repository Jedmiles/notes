import ApiStack from "./ApiStack";
import StorageStack from "./StorageStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x",
  });

  const storageStack: StorageStack = new StorageStack(app, "storage");

  new ApiStack(app, "api", {
    table: storageStack.table,
  });
}
