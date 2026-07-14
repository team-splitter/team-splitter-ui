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
  console.log(`[${tableName}] deleteGameSplit id=${id}`);
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
  console.log(`[${tableName}] getGameSplit id=${id}`);
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
  console.log(`[${tableName}] getGameSplitsByPoll pollId=${pollId}`);
  let response = await dynamo.send(
            new ScanCommand({ TableName: tableName,
              ProjectionExpression: "id, createdAt, teams, pollId, teamSize, telegramMessageId",
              FilterExpression: 'pollId = :pollId',
              ExpressionAttributeValues: {
                  ':pollId': pollId,
              },
            })
          ); 

  response.Items.forEach((game) => {
    game.teams.forEach((team) => {
      team.players = team.players.sort((a,b) => b.score - a.score);
    });
  });  
  return response; 
}

export const getAllGameSplits = async () => {
  console.log(`[${tableName}] getAllGameSplits`);
  return await dynamo.send(
            new ScanCommand({ TableName: tableName,
              ProjectionExpression: "id, createdAt, games, pollId, teamSize"
            })
          );
}

export const getAllGameSplitsPaginated = async (page, pageSize) => {
  console.log(`[${tableName}] getAllGameSplitsPaginated page=${page}, pageSize=${pageSize}`);
  const result = await dynamo.send(
    new ScanCommand({ TableName: tableName, ProjectionExpression: "id, createdAt, games, teams, pollId, teamSize" })
  );

  const items = (result.Items || []).sort((a, b) => b.createdAt - a.createdAt);
  const start = page * pageSize;

  // The games list only needs team names, so drop the (potentially large) player rosters.
  const content = items.slice(start, start + pageSize).map((item) => ({
    ...item,
    teams: item.teams?.map(({ players, ...team }) => team),
  }));

  return {
    content,
    totalElements: items.length
  };
}

export const updateGameSplitWithGames = async (id, gamesToAdd) => {
  console.log(`[${tableName}] updateGameSplitWithGames id=${id}, gameCount=${gamesToAdd?.length}`);
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
  console.log(`[${tableName}] saveGameSplit id=${gameSplitDocument?.id}, pollId=${gameSplitDocument?.pollId}, teamSize=${gameSplitDocument?.teamSize}`);
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: gameSplitDocument,
    })
  );
}

export const updateGameSplitTelegramMessageId = async (id, telegramMessageId) => {
  console.log(`[${tableName}] updateGameSplitTelegramMessageId id=${id}, telegramMessageId=${telegramMessageId}`);
  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: 'SET telegramMessageId = :telegramMessageId',
      ExpressionAttributeValues: { ":telegramMessageId": telegramMessageId }
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

export const movePlayerBetweenTeams = async (id, playerId, fromTeamName, toTeamName) => {
  console.log(`Moving player=${playerId} from team=${fromTeamName} to team=${toTeamName} in game split id=${id}`);
  const gameSplit = (await getGameSplit(id)).Item;

  const teams = gameSplit.teams;
  let playerToMove = null;

  teams.forEach((team) => {
    if (team.name === fromTeamName) {
      const idx = team.players.findIndex((p) => p.id === playerId);
      if (idx !== -1) {
        playerToMove = team.players[idx];
        team.players.splice(idx, 1);
      }
    }
  });

  if (!playerToMove) {
    throw new Error(`Player ${playerId} not found in team ${fromTeamName}`);
  }

  teams.forEach((team) => {
    if (team.name === toTeamName) {
      team.players.push(playerToMove);
    }
  });

  await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET teams = :teams',
      ExpressionAttributeValues: { ':teams': teams }
    })
  );

  return { ...gameSplit, teams };
}

export const getSplitsByDates = async (fromDate, toDate) => {
  console.log(`[${tableName}] getSplitsByDates fromDate=${fromDate}, toDate=${toDate}`);
  return await dynamo.send(
    new ScanCommand({ TableName: tableName,
      FilterExpression: "#date >= :fromDate and #date <= :toDate",
      ExpressionAttributeNames: {
        '#date': 'createdAt'
      },
      ExpressionAttributeValues: {
        ':fromDate': fromDate,
        ':toDate': toDate
      }
    })
  );
}