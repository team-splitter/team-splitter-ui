import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";



const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);
const envName = process.env.ENV;
const tableName = `player_${envName}`;

export const deletePlayer = async (id) => {
  return await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getPlayer = async (id) => {
 return  await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getAllPlayers = async () => {
  return await dynamo.send(
    new ScanCommand({ TableName: tableName})
  );
}

export const savePlayer = async (playerDocument) => {
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: playerDocument,
    })
  );
}

export const updatePlayerScoreWithPoints = async (id, points) => {
  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: 'SET score = score + :points',
      ExpressionAttributeValues: { ":points": points }
    })
  );
}