import {splitTeams} from "./team_splitter_service.mjs";
import {getPollsByDates, addVoteToPoll, removeVoteFromPollByPlayer, savePoll} from "../repo/poll_repo.mjs";
import {saveGameSplit} from "../repo/game_split_repo.mjs";
import {getPlayer, savePlayer} from "../repo/player_repo.mjs";
import {sendMessage, sendPoll, stopPoll} from "./telegram_api.mjs";


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
    if (!message.text) {
      console.log(`message doesn't have text. skipping`);
      return;
    }
    const text = message.text.trim();
  
    if (text.startsWith('/split')) {
      await handleSplitCommand(message, context);
    } else if (text.startsWith('/poll')) {
      await handlePollCommand(message, context);
    } else if (text.startsWith('/closepoll')) {
      await handleClosePollCommand(message, context);
    }

  } else {
    console.log(`playerId=${playerId} is not in allowedUsers=${allowedUsers}`);
  }
  
}

async function handleSplitCommand(message, context) {
  console.log('Hanlding /split command');
  
  const polls = (await getRecentPolls()).sort((a,b)=> b.createdAt - a.createdAt);//most recent is on top
  
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
      message += `${player.firstName ? player.firstName : ''} ${player.lastName ? player.lastName : ''}\n`;
    }
    
    message += '\n';
  }
  
  return message;
}

const getRecentPolls = async () => {
  const now = Date.now();
  const from = now - (3 * 24 * 60 * 60 * 1000);
  const to = now;
  
  console.log(`Find polls from=${from} to=${to}`);

  return (await getPollsByDates(from, to)).Items;
}

const addPollAnswer = async (pollAnswer, context) => {
  const playerId = parseInt(pollAnswer.user.id);

  const playerResponse = await getPlayer(playerId);
  console.log(`player response=${JSON.stringify(playerResponse)}`);
  let player;
  if (!playerResponse.Item) {
    player = {
      id: parseInt(pollAnswer.user.id),
      firstName: pollAnswer.user.first_name,
      lastName: pollAnswer.user.last_name,
      score: 50,
      privacy: false
    }
    await savePlayer(player);
    console.log(`created player = ${JSON.stringify(player)}`);
  } else {
    player = playerResponse.Item;
  }

  const playerVote = {
    id: context.awsRequestId, 
    player: player, 
    createdAt: Date.now()
  };
  await addVoteToPoll(pollAnswer.poll_id, playerVote);
}

const removePollAnswer = async (pollAnswer) => {
  const pollId = pollAnswer.poll_id;
  const playerId = parseInt(pollAnswer.user.id);

  await removeVoteFromPollByPlayer(pollId, playerId);
}

const handlePollCommand = async (message, context) => {
  const pollTitle = message.text.replace("/poll", "").trim();

  console.log(`Creating poll with title=${pollTitle}`);

  const payload = {
    "chat_id": chatId,
    "question": pollTitle,
    "options": ["+", "-"],
    "is_anonymous": false
  }

  const sendPollResponse = await sendPoll(payload);
  console.log(`sendPollResponse=${JSON.stringify(sendPollResponse)}`);

  const result = sendPollResponse.result;
  const poll = result.poll;

  const pollDocument = {
      id: poll.id,
      question: poll.question,
      createdAt: Date.now(),
      messageId: result.message_id,
      chatId: result.chat.id,
      answers: []
  };

  await savePoll(pollDocument);
} 

const handleClosePollCommand = async (message, context) => {
  console.log('Hanlding /closepoll command');

  const polls = (await getRecentPolls()).sort((a,b)=> b.createdAt - a.createdAt);//most recent is on top
  
  if (polls.length == 0) {
    console.log("No recent polls avaialbe");
    return;
  }
  
  const poll = polls.shift(); //take first 
  console.log(`poll to close = ${JSON.stringify(poll)}`);

  const payload = {
    "chat_id": poll.chatId,
    "message_id": poll.messageId
  }
  const stopPollResponse = await stopPoll(payload);

  console.log(`stopPollResponse=${JSON.stringify(stopPollResponse)}`);
}
