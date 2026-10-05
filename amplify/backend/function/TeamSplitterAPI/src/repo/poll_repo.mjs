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
  if (!pollResponse.Item) {
    console.log(`[${tableName}] removeVoteFromPollByPlayer poll ${pollId} not found, nothing to remove`);
    return;
  }

  // a vote can lack a player (e.g. added in the app for a player that was then deleted)
  const filteredAnswers = (pollResponse.Item.answers || []).filter((i) => i.player?.id !== playerId);
  console.log(`[${tableName}] removeVoteFromPollByPlayer pollId=${pollId} answers ${pollResponse.Item.answers?.length ?? 0} -> ${filteredAnswers.length}`);

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
  console.log(`[${tableName}] updatePlayerInPollVotes playerId=${playerId}, excluded polls=${excludePollIds.length}`);
  // Scan only ids (follows LastEvaluatedKey), then read in full just the polls that can still change:
  // reading every poll with all its votes made a player edit take ~7s
  const ids = [];
  let lastKey;
  do {
    const page = await dynamo.send(new ScanCommand({ TableName: tableName, ProjectionExpression: "id", ExclusiveStartKey: lastKey }));
    ids.push(...(page.Items || []).map((poll) => poll.id));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);
  const excludeSet = new Set(excludePollIds);
  const candidates = (await Promise.all(ids.filter((id) => !excludeSet.has(id)).map((id) => getPoll(id))))
    .map((response) => response.Item)
    .filter((poll) => poll);
  const pollsWithPlayer = candidates.filter(p => p.answers?.some(a => a.player?.id === playerId));
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

// One GetItem per poll: the Lambda's IAM role has no BatchGetItem, and a 60-day range is a few dozen polls
export const getPollQuestionsByIds = async (ids) => {
  console.log(`[${tableName}] getPollQuestionsByIds count=${ids.length}`);
  const responses = await Promise.all(ids.map((id) => dynamo.send(
    new GetCommand({ TableName: tableName, Key: { id }, ProjectionExpression: "id, question" })
  )));
  return responses.map((response) => response.Item).filter((poll) => poll);
}
