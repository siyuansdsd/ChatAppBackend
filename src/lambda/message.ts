import DynamoDB from "../db/db";
import { v4 as uuid } from "uuid";
import { ApiGatewayManagementApi } from "aws-sdk";
import { BadRequestError, Response } from "../common/common";
import { logger } from "../../shared/utils/logger";

const dynamoDb = new DynamoDB();

export const sendMessage = async (event: any) => {
  const apiGateway = new ApiGatewayManagementApi({
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  const { message, chatroom, user } = JSON.parse(event.body);

  const putParameter = {
    TableName: process.env.MESSAGES_TABLE! as string,
    Item: {
      messageId: uuid(),
      chatroom,
      user,
      message,
    },
  };

  const connectionParameters = {
    TableName: "DouglasChatConnections",
  };

  const connections = await dynamoDb.dbScan(connectionParameters);
  logger.info("Connections: " + JSON.stringify(connections));
  if (connections.statusCode !== 200) {
    return new BadRequestError("Failed to get connections").response();
  }

  const result = await dynamoDb.dbPut(putParameter);
  if (result.statusCode !== 200) {
    return new BadRequestError("Failed to send message").response();
  }

  const postCalls = connections.data?.map(
    async (connection: Record<string, any>) => {
      if (user !== connection.user) {
        const connectionId = connection.connectionId;
        try {
          await apiGateway
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify({ message, user, time: Date.now() }),
            })
            .promise();
        } catch (error) {
          logger.error(
            "Failed to send message to connection: " + connectionId + " " + user
          );
          logger.error(error);
        }
      }
    }
  );

  await Promise.all(postCalls || []);
  return Response(200, { message: "Message sent" });
};
