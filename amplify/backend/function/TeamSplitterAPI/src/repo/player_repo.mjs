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
  console.log(`[${tableName}] deletePlayer id=${id}`);
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
 console.log(`[${tableName}] getPlayer id=${id}`);
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
  console.log(`[${tableName}] getAllPlayers`);
  return await dynamo.send(
    new ScanCommand({ TableName: tableName})
  );
}

export const savePlayer = async (playerDocument) => {
  console.log(`[${tableName}] savePlayer id=${playerDocument?.id}, firstName=${playerDocument?.firstName}`);
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: playerDocument,
    })
  );
}

export const updatePlayerScoreWithPoints = async (id, points) => {
  console.log(`[${tableName}] updatePlayerScoreWithPoints id=${id}, points=${points}`);
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