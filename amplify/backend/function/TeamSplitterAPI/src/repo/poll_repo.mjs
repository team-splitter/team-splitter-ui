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
  return await dynamo.send(
    new ScanCommand({ TableName: tableName, ProjectionExpression: "id, createdAt, question" })
  );
}

export const getPollsByDates = async (from, to) => {
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
  const poll = (await getPoll(pollId)).Item;
        
  const updatedAnswers = poll.answers.filter((i) => i.id !== voteId);
  
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
  const pollResponse = await getPoll(pollId);

  const filteredAnswers = pollResponse.Item.answers.filter((i) => i.player.id !== playerId);

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