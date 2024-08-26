import * as Cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { createApiGatewayStack } from "./apiGatewatStack";
import { createDynamoDBStack } from "./dynamoDBStack";

export default class ChatAppStack extends Cdk.Stack {
  constructor(scope: Construct, id: string, props?: Cdk.StackProps) {
    super(scope, id, props);

    createDynamoDBStack(this);
    createApiGatewayStack(this);
  }
}
