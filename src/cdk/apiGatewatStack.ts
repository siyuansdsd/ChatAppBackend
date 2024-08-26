import * as Cdk from "aws-cdk-lib";
import * as apigatewayv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as Lambda from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

export function createApiGatewayStack(stack: Cdk.Stack) {
  const messageLambda = new NodejsFunction(stack, "MessageLambda", {
    runtime: Lambda.Runtime.NODEJS_18_X,
    handler: "sendMessageHandler",
    entry: join("./.build/chat.js"),
    environment: {
      MESSAGES_TABLE: process.env.MESSAGES_TABLE as string,
    },
    timeout: Cdk.Duration.seconds(20),
  }) as Lambda.IFunction;

  messageLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:*"],
      resources: [
        `${process.env.MESSAGES_TABLE_ARN as string}`,
        `${process.env.CONNECTIONS_TABLE_ARN as string}`, // need get connections to send message
      ],
    })
  );

  messageLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["execute-api:*"],
      resources: [`${process.env.API_ARN as string}`],
    })
  );

  const connectionLambda = new NodejsFunction(stack, "ConnectionLambda", {
    runtime: Lambda.Runtime.NODEJS_18_X,
    handler: "onConnectHandler",
    entry: join("./.build/chat.js"),
    environment: {
      CONNECTIONS_TABLE: process.env.CONNECTIONS_TABLE as string,
    },
    timeout: Cdk.Duration.seconds(20),
  }) as Lambda.IFunction;

  connectionLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:*"],
      resources: [`${process.env.CONNECTIONS_TABLE_ARN as string}`],
    })
  );

  const disconnectionLambda = new NodejsFunction(stack, "DisconnectionLambda", {
    runtime: Lambda.Runtime.NODEJS_18_X,
    handler: "disconnectHandler",
    entry: join("./.build/chat.js"),
    environment: {
      CONNECTIONS_TABLE: process.env.CONNECTIONS_TABLE as string,
    },
    timeout: Cdk.Duration.seconds(20),
  }) as Lambda.IFunction;

  disconnectionLambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:*"],
      resources: [`${process.env.CONNECTIONS_TABLE_ARN as string}`],
    })
  );

  const websocketApi = new apigatewayv2.WebSocketApi(stack, "ChatApi", {
    apiName: "ChatApi",
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "connectionIntegration",
        connectionLambda
      ),
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "disconnectionIntegration",
        disconnectionLambda
      ),
    },

    defaultRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "messageIntegration",
        messageLambda
      ),
    },
  });

  const stage = new apigatewayv2.WebSocketStage(stack, "ChatStage", {
    webSocketApi: websocketApi,
    stageName: "prod",
    autoDeploy: true,
  });

  new Cdk.CfnOutput(stack, "ChatApiUrl", {
    value: websocketApi.apiEndpoint,
    description: "Chat API URL",
  });

  return { websocketApi, stage };
}
