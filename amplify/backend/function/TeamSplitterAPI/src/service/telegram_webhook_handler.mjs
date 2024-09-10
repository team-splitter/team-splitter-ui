import {splitTeams} from "./team_splitter_service.mjs";
import {getPollsByDates, addVoteToPoll, removeVoteFromPollByPlayer} from "../repo/poll_repo.mjs";
import {saveGameSplit} from "../repo/game_split_repo.mjs";
import {getPlayer} from "../repo/player_repo.mjs";
import {sendMessage} from "./telegram_api.mjs";


const allowedUsers = [355281005,156023871];
const knownCommands = ["/split", "/poll", "/closepoll"];

const chatId = process.env.CHAT_ID;


export const handleTelegramUpdate = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    
    if (requestBody.poll_answer) {
      await handlePollAnswer(requestBody, context);
    } 
    
    if (requestBody.message) {
      await handleMessage(requestBody, context);
      
    }
}

async function handlePollAnswer(requestBody, context) {
  console.log('Poll answer update');
  const pollAnswer = requestBody.poll_answer;
  
  
  if (pollAnswer.option_ids.length == 0) {//retract vote
    console.log("Retract vote");
    await removePollAnswer(pollAnswer);
  } else if (pollAnswer.option_ids[0] === 0) {//going
    console.log("Add vote");
    await addPollAnswer(pollAnswer, context);
  } else {
    console.log("Ignore vote");
  }
}


async function handleMessage(requestBody, context) {
  const message = requestBody.message;
  const playerId = message.from.id;
  
  if (allowedUsers.includes(playerId)) {
    const text = message.text.trim();
  
    if (text.startsWith('/split')) {
      await handleSplitCommand(message, context);
    } else if (text.startsWith('/poll')) {
      console.log('Hanlding /poll command');
    } else if (text.startsWith('/closepoll')) {
      console.log('Hanlding /closepoll command');
    }

  } else {
    console.log(`playerId=${playerId} is not in allowedUsers=${allowedUsers}`);
  }
  
}

async function handleSplitCommand(message, context) {
  console.log('Hanlding /split command');
  
  const polls = (await getPolls()).sort((a,b)=> b.createdAt - a.createdAt);//most recent is on top
  
  if (polls.length == 0) {
    console.log("No polls avaialbe for split");
    return;
  }
  
  const poll = polls.shift(); //take first 
  console.log(`poll to split = ${JSON.stringify(poll)}`);
  
  const players = poll.answers.map((i) => i.player);
  
  const tokens = message.text.split(/\s+/);
  const teamNum = tokens.length > 1 && !isNaN(parseInt(tokens[1]))  ? parseInt(tokens[1]) : 2;
  const teams = splitTeams(players, teamNum);
  
  const sendMessageResponse = await sendTeamSplitMessage(teams);
  console.log(`sendTegegrameMessage response =${JSON.stringify(sendMessageResponse)}`);
  
  await saveGameSplit({
    id: context.awsRequestId,
    pollId: poll.id,
    createdAt: Date.now(),
    teams,
    teamSize: teamNum,
    splitAlg: 'TEAM_SCORE_BALANCE'
  })
  
}

const sendTeamSplitMessage = async (teams) => {
  const message = createTeamSplitMessage(teams);
  console.log(`message=${message}`);
  
  const payload = {
    "chat_id": chatId,
    "text": message,
    "parse_mode": "MarkdownV2"
  }
      

  return await sendMessage(payload);
}

const createTeamSplitMessage = (teams) => {
  let message = '';
  for(let team of teams) {
    message += `*Team ${team.name}*\n`;
    
    for(let player of team.players) {
      message += `${player.firstName} ${player.lastName}\n`;
    }
    
    message += '\n';
  }
  
  
  return message;
}

async function getPolls() {
  const now = Date.now();
  const from = now - (3 * 24 * 60 * 60 * 1000);
  const to = now;
  
  console.log(`Find polls from=${from} to=${to}`);

  return (await getPollsByDates(from, to)).Items;
}

async function addPollAnswer(pollAnswer, context) {
  const playerId = parseInt(pollAnswer.user.id);

  const playerResponse = await getPlayer(playerId);
  const playerVote = {id: context.awsRequestId, player: playerResponse.Item, createdAt: Date.now()};
  await addVoteToPoll(pollAnswer.poll_id, playerVote);
}

async function removePollAnswer(pollAnswer) {
  const pollId = pollAnswer.poll_id;
  const playerId = parseInt(pollAnswer.user.id);

  await removeVoteFromPollByPlayer(pollId, playerId);
}

