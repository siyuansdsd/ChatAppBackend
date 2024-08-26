# ChatAppBackend

# Table of Content

- [Introduction](#introduction)
- [Technologies](#technologies-used)
- [Getting_Started](#getting-started)
- [Future](#future)

## Introduction

Really thank you for watching this project!

This is a Chat room demo, allow clients chat real-time online through wss.

There is 1 api for chat goals:
wss://21st7ias6g.execute-api.ap-southeast-2.amazonaws.com/prod?user={yourUserName}&chatroom=1

Or come to visit [demo website](https://chat.douglas-yang.com),
It provide a web UI for you to try the features

you should use Postman websocket template or other wws tools to check its performance

## Technologies Used

- [TypeScript](https://github.com/microsoft/TypeScript)
- [AWS_CDK](https://github.com/aws/aws-cdk)
  I use following services:
  AWS DynamoDB
  AWS Lambda
  AWS ApiGateway

* [AWS_SDK](https://github.com/aws/aws-sdk-js-v3)
  Mainly for provide some Type for our Vars.

## Getting Started

1. Clone the repository to your local machine.

2. Install the project dependencies by running:

```bash
$ npm install
```

Reminder: better to use node version >= 18

you can use nvm to change your node version

3. Create an env file, and it should contained:
   you can copy from [.env.template]('/.env.template')

```txt
CONNECTIONS_TABLE = DouglasChatConnections
MESSAGES_TABLE = DouglasChatMessages

CONNECTIONS_TABLE_ARN =
MESSAGES_TABLE_ARN =
API_ARN =

REGION =
ACCOUNT_ID =
```

4. using webpack pack files

```bash
$ npm run build
```

you can find the packed file in ./build under the root path

5. using cdk finish Lambda function deploy

first time will spend about 3 mins on building

```bash
$ npm run deploy
```

Then you can find there is an output in your local console about your api information(different from mine)

## Future

I left some logic for future scale like chat room control to control different chatroom and their configures.

And It is just an demo, Type check is not so strick, for fully type support please contact me.
