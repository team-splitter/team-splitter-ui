import {getSchedulesByDateRangeAndStatus, updateGameScheduleStatusAndPollId} from "../repo/game_schedule_repo.mjs";
import { sendPoll } from "./telegram_api.mjs";
import { savePoll } from "../repo/poll_repo.mjs";


const chatId = process.env.CHAT_ID;

export const handleGameSchedule = async () => {
    const fromDate = Date.now();
    const toDate = fromDate + (2 * 24 * 60 * 60 * 1000); //2 days in advance
    console.log(`handleGameSchedule invoked. Looking for CREATED schedules from=${fromDate} to=${toDate}`);
    let schedules = (await getSchedulesByDateRangeAndStatus(fromDate, toDate, 'CREATED')).Items;
    console.log(`Found ${schedules?.length ?? 0} CREATED schedule(s) in range`);

    schedules = schedules.sort((a,b)=> a.date - b.date);

    if (schedules.length > 0) {
      const schedule = schedules.shift();
      console.log(`Selected schedule id=${schedule.id}, date=${schedule.date}, location=${schedule.location}`);
      const pollTitle = createPollTitle(schedule);
      console.log(`Created poll title="${pollTitle}"`);

      const payload = {
        "chat_id": chatId,
        "question": pollTitle,
        "options": ["+", "-"],
        "is_anonymous": false
      }

      const sendPollResponse =  await sendPoll(payload);
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

      console.log(`Saving poll document id=${pollDocument.id}, messageId=${pollDocument.messageId}, chatId=${pollDocument.chatId}`);
      await savePoll(pollDocument);

      console.log(`Updating schedule id=${schedule.id} to POLL_OPENED with pollId=${pollDocument.id}`);
      await updateGameScheduleStatusAndPollId(schedule.id, pollDocument.id, 'POLL_OPENED');
      console.log(`Poll created id=${poll.id} for schedule id=${schedule.id}`);
      return `Poll created id=${poll.id}`;
    } else {
      console.log('No game schedules to open a poll for');
      return 'no game schedules';
    }
}

const formatDate = (theDate) => {
    const day = theDate.getUTCDate();
    const twoDigitDay = day < 10 ? "0" + day : day; 
    const month = theDate.getUTCMonth()+1;
    const twoDigitMonth = month < 10? "0" + month: month;
    const year = theDate.getUTCFullYear().toString();
    const hours = theDate.getUTCHours() % 12;
    const twoDigitHours = hours < 10 ? "0" + hours : hours;
    const mins = theDate.getUTCMinutes() < 10 ? "0" + theDate.getUTCMinutes() : theDate.getUTCMinutes();

    const am = theDate.getUTCHours() / 12 < 1;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayName = days[ theDate.getDay() ];
    const formattedDate = `${dayName} (${twoDigitMonth}-${twoDigitDay}-${year}) at ${twoDigitHours}:${mins} ${am ? 'AM' : 'PM'}`;
    
    return formattedDate;
}
  
const createPollTitle = (schedule) => {
    const nyDate = new Date(new Date(schedule.date).toLocaleString("en-US", {timeZone: "America/New_York"}));
    let message = `Game is on ${formatDate(nyDate)} at ${schedule.location}`;

    return message;
}
  
  
  