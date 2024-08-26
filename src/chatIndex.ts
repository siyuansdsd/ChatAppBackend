import { onConnect, disconnect } from "./lambda/connection";
import { sendMessage } from "./lambda/message";
import dotenv from "dotenv";

dotenv.config();

export const onConnectHandler = async (event: any) => {
  return await onConnect(event);
};

export const disconnectHandler = async (event: any) => {
  return await disconnect(event);
};

export const sendMessageHandler = async (event: any) => {
  return await sendMessage(event);
};
