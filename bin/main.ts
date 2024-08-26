import "source-map-support/register";
import * as Cdk from "aws-cdk-lib";
import ChatAppStack from "../src/cdk";
import dotenv from "dotenv";

dotenv.config();
const app = new Cdk.App();

new ChatAppStack(app, "ChatAppStack", {
  env: {
    region: process.env.REGION as string,
    account: process.env.ACCOUNT as string,
  },
});

app.synth();
