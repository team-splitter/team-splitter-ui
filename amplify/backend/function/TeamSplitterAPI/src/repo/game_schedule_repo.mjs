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
const tableName = `game_schedule_${envName}`;

export const deleteGameSchedule = async (id) => {
  return await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getGameSchedule = async (id) => {
  return await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    })
  );
}

export const getAllGameSchedules = async () => {
  return await dynamo.send(
    new ScanCommand({ TableName: tableName})
  );
}

export const saveGameSchedule = async (gameSchedule) => {
  return await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: gameSchedule,
    })
  );
}

export const getSchedulesByDateRangeAndStatus = async (fromDate, toDate, status) => {
  return await dynamo.send(
    new ScanCommand({ TableName: tableName,
      FilterExpression: "#date >= :fromDate and #date <= :toDate and #status = :status",
      ExpressionAttributeNames: {
        '#date': 'date',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':fromDate': fromDate,
        ':toDate': toDate,
        ':status': status
      }
    })
  );
}

export const updateGameScheduleStatusAndPollId = async (id, pollId, status) => {
  return await dynamo.send(
      new UpdateCommand({
            TableName: tableName,
            Key: {
              id: id,
            },
            UpdateExpression: 'SET #status = :status, pollId = :pollId',
            ExpressionAttributeNames: { "#status" : "status" },
            ExpressionAttributeValues: { ":status": status, ":pollId": pollId }
          })
    );
}