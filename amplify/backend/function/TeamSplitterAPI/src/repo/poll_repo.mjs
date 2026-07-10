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
const tableName = `poll_${envName}`;


export const deletePoll = async (id) => {
   console.log(`[${tableName}] deletePoll id=${id}`);
   return await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getPoll = async (id) => {
  console.log(`[${tableName}] getPoll id=${id}`);
  return await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getAllPolls = async () => {
  console.log(`[${tableName}] getAllPolls`);
  return await dynamo.send(
    new ScanCommand({ TableName: tableName, ProjectionExpression: "id, createdAt, question" })
  );
}

export const getAllPollsPaginated = async (page, pageSize) => {
  console.log(`[${tableName}] getAllPollsPaginated page=${page}, pageSize=${pageSize}`);
  const result = await dynamo.send(
    new ScanCommand({ TableName: tableName, ProjectionExpression: "id, createdAt, question" })
  );

  const items = (result.Items || []).sort((a, b) => b.createdAt - a.createdAt);
  const start = page * pageSize;

  return {
    content: items.slice(start, start + pageSize),
    totalElements: items.length
  };
}

export const getPollsByDates = async (from, to) => {
  console.log(`[${tableName}] getPollsByDates from=${from}, to=${to}`);
  return await dynamo.send(
    new ScanCommand({ TableName: tableName,
      FilterExpression: "#date >= :fromDate and #date <= :toDate",
      ExpressionAttributeNames: {
        '#date': 'createdAt'
      },
      ExpressionAttributeValues: {
        ':fromDate': from,
        ':toDate': to
      }
    })
  );
}

export const addVoteToPoll = async (id, playerVote) => {
  console.log(`[${tableName}] addVoteToPoll pollId=${id}, playerId=${playerVote?.player?.id}, voteId=${playerVote?.id}`);
  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: 'SET #answers = list_append(if_not_exists(#answers, :empty_list), :player)',
      ExpressionAttributeNames: { "#answers" : "answers" },
      ExpressionAttributeValues: { ":player": [playerVote], ":empty_list": [] }
    })
  );
}


export const removeVoteFromPoll = async (pollId, voteId) => {
  console.log(`[${tableName}] removeVoteFromPoll pollId=${pollId}, voteId=${voteId}`);
  const poll = (await getPoll(pollId)).Item;

  const updatedAnswers = poll.answers.filter((i) => i.id !== voteId);
  console.log(`[${tableName}] removeVoteFromPoll pollId=${pollId} answers ${poll.answers.length} -> ${updatedAnswers.length}`);

  return await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: pollId,
      },
      UpdateExpression: 'SET answers = :answers',
      ExpressionAttributeValues: { ":answers": updatedAnswers }
    })
  );
}

export const removeVoteFromPollByPlayer = async (pollId, playerId) => {
  console.log(`[${tableName}] removeVoteFromPollByPlayer pollId=${pollId}, playerId=${playerId}`);
  const pollResponse = await getPoll(pollId);

  const filteredAnswers = pollResponse.Item.answers.filter((i) => i.player.id !== playerId);
  console.log(`[${tableName}] removeVoteFromPollByPlayer pollId=${pollId} answers ${pollResponse.Item.answers.length} -> ${filteredAnswers.length}`);

  const response = await dynamo.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: pollId,
      },
      UpdateExpression: 'SET #answers = :filteredAnswers',
      ExpressionAttributeNames: { "#answers" : "answers" },
      ExpressionAttributeValues: { ":filteredAnswers": filteredAnswers }
    })
  );
}

export const updatePlayerInPollVotes = async (playerId, playerData, excludePollIds = []) => {
  console.log(`[${tableName}] updatePlayerInPollVotes playerId=${playerId}, excludePollIds=${JSON.stringify(excludePollIds)}`);
  const polls = (await dynamo.send(new ScanCommand({ TableName: tableName }))).Items || [];
  const excludeSet = new Set(excludePollIds);
  const pollsWithPlayer = polls.filter(p => !excludeSet.has(p.id) && p.answers?.some(a => a.player?.id === playerId));
  console.log(`[${tableName}] updatePlayerInPollVotes updating playerId=${playerId} across ${pollsWithPlayer.length} poll(s)`);

  await Promise.all(pollsWithPlayer.map(poll => {
    const updatedAnswers = poll.answers.map(a =>
      a.player?.id === playerId ? { ...a, player: { ...a.player, ...playerData } } : a
    );
    return dynamo.send(new UpdateCommand({
      TableName: tableName,
      Key: { id: poll.id },
      UpdateExpression: 'SET answers = :answers',
      ExpressionAttributeValues: { ':answers': updatedAnswers }
    }));
  }));
}

export const savePoll = async (pollDocument) => {
  console.log(`[${tableName}] savePoll id=${pollDocument?.id}, question="${pollDocument?.question}"`);
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: pollDocument,
    })
  );
}