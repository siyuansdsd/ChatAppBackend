import * as Cdk from "aws-cdk-lib";
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb";

export function createDynamoDBStack(stack: Cdk.Stack): {
  messageTable: Dynamodb.Table;
  connectionTable: Dynamodb.Table;
} {
  const messageTable: Dynamodb.Table = new Dynamodb.Table(
    stack,
    process.env.MESSAGES_TABLE as string,
    {
      tableName: process.env.MESSAGES_TABLE as string,
      partitionKey: { name: "messageId", type: Dynamodb.AttributeType.STRING },
      billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
    }
  );

  const connectionTable: Dynamodb.Table = new Dynamodb.Table(
    stack,
    process.env.CONNECTIONS_TABLE as string,
    {
      tableName: process.env.CONNECTIONS_TABLE as string,
      partitionKey: {
        name: "connectionId",
        type: Dynamodb.AttributeType.STRING,
      },
      billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
    }
  );

  new Cdk.CfnOutput(stack, "MessageTableARN", {
    value: messageTable.tableArn,
    description: "Message table ARN",
  });

  new Cdk.CfnOutput(stack, "ConnectionTableARN", {
    value: connectionTable.tableArn,
    description: "Connection table ARN",
  });

  return { messageTable, connectionTable };
}
