import DynamoDB from "../db/db";
import { BadRequestError, Response } from "../common/common";

const dynamoDb = new DynamoDB();

export const onConnect = async (event: any) => {
  const connectionId = event.requestContext.connectionId;
  const { user, chatroom } = event.queryStringParameters;
  const putParameters = {
    TableName: process.env.CONNECTIONS_TABLE!,
    Item: {
      connectionId,
      user,
      chatroom,
    },
  };

  const result = await dynamoDb.dbPut(putParameters);
  if (result.statusCode !== 200) {
    return new BadRequestError("Failed to connect").response();
  }
  // const response = Response(200, { message: "Connected" });
  return { statusCode: 200, body: "connected" };
};

export const disconnect = async (event: any) => {
  const connectionId = event.requestContext.connectionId;
  const deleteParameters = {
    TableName: process.env.CONNECTIONS_TABLE!,
    Key: { S: connectionId },
  };

  const result = await dynamoDb.dbDelete(deleteParameters);
  if (result.statusCode !== 200) {
    return new BadRequestError("Failed to disconnect").response();
  }

  return { statusCode: 200, body: "disconnected" };
};
