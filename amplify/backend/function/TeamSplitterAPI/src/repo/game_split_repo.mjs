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
const tableName = `game_split_${envName}`;


export const deleteGameSplit = async (id) => {
  return await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getGameSplit = async (id) => {
  return await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: id,
            }
          })
        );
}

export const getGameSplitsByPoll = async (pollId) => {
  return await dynamo.send(
            new ScanCommand({ TableName: tableName,
              ProjectionExpression: "id, createdAt, teams, pollId, teamSize",
              FilterExpression: 'pollId = :pollId',
              ExpressionAttributeValues: {
                  ':pollId': pollId,
              },
            })
          );  
}

export const getAllGameSplits = async () => {
  return await dynamo.send(
            new ScanCommand({ TableName: tableName,
              ProjectionExpression: "id, createdAt, games, pollId, teamSize"  
            })
          );
}

export const updateGameSplitWithGames = async (id, gamesToAdd) => {
  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: 'SET games = :games',
      ExpressionAttributeValues: { ":games": gamesToAdd }
    })
  );
}

export const saveGameSplit = async (gameSplitDocument) => {
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: gameSplitDocument,
    })
  );
}

export const removePlayerFromSplit = async (id, playerId) => {
  console.log(`Removing player=${playerId} from game split id=${id}`);
  const gameSplit = (await getGameSplit(id)).Item;

  const teams = gameSplit.teams;
  teams.forEach((team) => {
    team.players = team.players.filter((player) => (player.id !== playerId));
  });

  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: 'SET teams = :teams',
      ExpressionAttributeValues: { ":teams": teams }
    })
  );
}