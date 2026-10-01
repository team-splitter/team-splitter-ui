import {getSplitsCreatedSince} from "../repo/game_split_repo.mjs";
import {getSchedulesWithPoll} from "../repo/game_schedule_repo.mjs";
import {getPollQuestionsByIds} from "../repo/poll_repo.mjs";

const DEFAULT_RANGE_MS = 60 * 24 * 60 * 60 * 1000;

// en-CA formats as YYYY-MM-DD
const nyDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
});
const toNyDate = (epochMs) => nyDateFormat.format(new Date(epochMs));

const parseDateParam = (value, name, defaultValue) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${name} must be epoch milliseconds`);
  }
  return parsed;
}

// only positive integers can be Telegram ids; anything else (e.g. a player added by hand) is unknown
const toTelegramId = (id) => {
  const parsed = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

const toPlayer = (player) => ({
  id: toTelegramId(player.id),
  firstName: player.firstName ? player.firstName : '',
  lastName: player.lastName ? player.lastName : ''
});

// The newest split of every poll whose newest split was made between startDate and endDate (inclusive),
// with each player listed once. Used by the payments bot to count who played.
export const getPlayersByGame = async (startDateParam, endDateParam) => {
  const now = Date.now();
  const endDate = parseDateParam(endDateParam, 'endDate', now);
  const startDate = parseDateParam(startDateParam, 'startDate', now - DEFAULT_RANGE_MS);
  if (startDate > endDate) {
    throw new Error(`startDate (${startDate}) is after endDate (${endDate})`);
  }
  console.log(`getPlayersByGame invoked. startDate=${startDate}, endDate=${endDate}`);

  // no upper bound in the scan: a poll whose newest split is after endDate must be left out, not shown with an older split
  const newestSplitByPoll = {};
  for (const split of await getSplitsCreatedSince(startDate)) {
    if (!split.pollId) continue;
    const current = newestSplitByPoll[split.pollId];
    if (!current || split.createdAt > current.createdAt) {
      newestSplitByPoll[split.pollId] = split;
    }
  }
  const splits = Object.values(newestSplitByPoll).filter((split) => split.createdAt <= endDate);
  console.log(`getPlayersByGame found ${splits.length} poll(s) with a newest split in range`);

  if (splits.length === 0) {
    return { games: [] };
  }

  const scheduleByPoll = {};
  (await getSchedulesWithPoll()).forEach((schedule) => { scheduleByPoll[schedule.pollId] = schedule; });

  const questionByPoll = {};
  (await getPollQuestionsByIds(splits.map((split) => split.pollId)))
    .forEach((poll) => { questionByPoll[poll.id] = poll.question; });

  const games = splits.map((split) => {
    const schedule = scheduleByPoll[split.pollId];
    const seenIds = new Set();
    const teams = (split.teams || []).map((team) => ({
      name: team.name,
      players: (team.players || []).map(toPlayer).filter((player) => {
        if (player.id === null) return true;
        if (seenIds.has(player.id)) return false;
        seenIds.add(player.id);
        return true;
      })
    }));

    return {
      pollId: split.pollId,
      pollQuestion: questionByPoll[split.pollId] ?? null,
      gameDate: toNyDate(schedule?.date ?? split.createdAt),
      gameDateApproximate: !schedule?.date,
      status: schedule?.status ?? null,
      splitId: split.id,
      splitCreatedAt: split.createdAt,
      hasScores: Array.isArray(split.games) && split.games.length > 0,
      teams
    };
  });

  games.sort((a, b) => a.gameDate.localeCompare(b.gameDate) || a.splitCreatedAt - b.splitCreatedAt);
  return { games };
}
