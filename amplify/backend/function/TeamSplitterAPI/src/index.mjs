import {deletePoll, getPoll, getAllPolls, addVoteToPoll, removeVoteFromPoll} from './repo/poll_repo.mjs';
import {getPlayer, deletePlayer, getAllPlayers, savePlayer} from './repo/player_repo.mjs';
import {deleteGameSplit, getGameSplit, getGameSplitsByPoll, updateGameSplitWithGames, getAllGameSplits} from './repo/game_split_repo.mjs';
import {deleteGameSchedule, getGameSchedule, getAllGameSchedules, saveGameSchedule} from './repo/game_schedule_repo.mjs';
import {handleTelegramUpdate} from "./service/telegram_webhook_handler.mjs";
import {splitTeams} from "./service/team_splitter_service.mjs";


export const handler = async (event, context) => {
  console.log(`event=${JSON.stringify(event)}`);
  
  let body;
  let requestJSON;
  let statusCode = 200;
  let response;
  
  
  const routeKey = `${event.httpMethod} ${event.path}`;

  try {
    switch (routeKey) {
      case routeKey.match("DELETE /api/v1/poll/.*$")?.input: {
        const id = event.path.split('/')[4];
        await deletePoll(id);
        body = id;
        break;
      }
      case routeKey.match("GET /api/v1/poll/.*$")?.input: {
        const id = event.path.split('/')[4];
        body = (await getPoll(id)).Item;
        break;
      }
      case "GET /api/v1/poll":
        body = (await getAllPolls()).Items;
        break;
      case routeKey.match("POST /api/v1/poll/.*/vote$")?.input: {
        const pollId = event.path.split('/')[4];
        requestJSON = JSON.parse(event.body);
        
        const player = await getPlayer(requestJSON.player.id);
        const playerVote = {id: context.awsRequestId, player: player.Item, createdAt: Date.now()};
        
        await addVoteToPoll(pollId, playerVote);
        
        body = playerVote;
        break;
      }
      case routeKey.match("DELETE /api/v1/poll/.*/vote/.*$")?.input: {
        const pollId = event.path.split('/')[4];
        const voteId = event.path.split('/')[6];
        await removeVoteFromPoll(pollId, voteId)
        
        body = voteId;
        break;
      }
      case routeKey.match("DELETE /api/v1/player/.*$")?.input: {
        const playerId = event.path.split('/')[4];
        await deletePlayer(parseInt(playerId));
        body = `Deleted item ${playerId}`;
        break;
      }
      case routeKey.match("GET /api/v1/player/.*$")?.input: {
        const playerId = event.path.split('/')[4];
        body = await getPlayer(parseInt(playerId))
        body = body.Item;
        break;
      }
      case "GET /api/v1/player":
        body = (await getAllPlayers()).Items;
        break;
      case routeKey.match("PUT /api/v1/player/.*$")?.input: {
        const playerId = parseInt(event.path.split('/')[4]);
        requestJSON = JSON.parse(event.body);
        let exisinting = await getPlayer(playerId);
        
        exisinting = exisinting.Item;
        exisinting.firstName = requestJSON.firstName;
        exisinting.lastName = requestJSON.lastName;
        exisinting.score = requestJSON.score;
        
        await savePlayer(exisinting);
        body = exisinting;
        break;
      }
      case "POST /api/v1/player":
        requestJSON = JSON.parse(event.body);
        
        const createPlayerBody = {
          id: requestJSON.id,
          firstName: requestJSON.firstName,
          lastName: requestJSON.lastName,
          score: requestJSON.score
        };
        await savePlayer(createPlayerBody);
        
        body = createPlayerBody;
        break;
      case routeKey.match("DELETE /api/v1/game-split/.*$")?.input:{
        const id = event.path.split('/')[4];
        await deleteGameSplit(id);
        body = `${id}`;
        break;
      }
      case routeKey.match("GET /api/v1/game-split/{id}")?.input: {
        const id = event.path.split('/')[4];
        body = await getGameSplit(id);
        body = body.Item;
        break;
      }
      case "GET /api/v1/game-split":
        if (event.queryStringParameters && event.queryStringParameters.pollId) {
          response = await getGameSplitsByPoll(event.queryStringParameters.pollId)
        } else {
          response = await getAllGameSplits();
        }
        
        body = {
          content: response.Items,
          totalElements: response.Count
        };
        break;
      case routeKey.match("POST /api/v1/game-split/.*/score")?.input: {
        const id = event.path.split('/')[4];
        requestJSON = JSON.parse(event.body);
        
        const games = requestJSON.map((item) => {
          return {
            teamOneName: item.teamOneName,
            teamTwoName: item.teamTwoName,
            teamOneScored: item.teamOneScored,
            teamTwoScored: item.teamTwoScored,
            createdAt: Date.now()
          }
        });

        body = await updateGameSplitWithGames(id, games);
        body = games;
        
        break;
      }
      case routeKey.match("DELETE /api/v1/game-schedule/.*$")?.input: {
        const id = event.path.split('/')[4];
        await deleteGameSchedule(id);
        body = id;
        break;
      }
      case routeKey.match("GET /api/v1/game-schedule/.*$")?.input: {
        const id = event.path.split('/')[4];
        body = (await getGameSchedule(id)).Item;
        break;
      }
      case "GET /api/v1/game-schedule":
        body = (await getAllGameSchedules()).Items;
        break;
      case "POST /api/v1/game-schedule":
        requestJSON = JSON.parse(event.body);
        
        const createGameScheduleBody = {
              id: context.awsRequestId,
              date: requestJSON.date,
              status: 'CREATED',
              location: requestJSON.location
            };
            
        await saveGameSchedule(createGameScheduleBody);
        body = createGameScheduleBody;
        break;
      case "POST /api/v1/telegram-callback":
        await handleTelegramUpdate(event, context);
        break;
      case routeKey.match("GET /api/v1/team/split/.*$")?.input: {
        const pollId = event.path.split('/')[5];
        const teamNum = parseInt(event.queryStringParameters.teamsNum);
        let poll = await getPoll(pollId);
        body = splitTeams(poll.Item.answers.map((i) => i.player).filter((i) => i !== undefined), teamNum);
        break;
      }
      default:
        throw new Error(`Unsupported route: "${routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    console.log(`error occured = ${err.message}`);
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Credentials" : true 
    }
  };
};
