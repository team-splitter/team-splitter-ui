// Games are in New York, so "which day" questions use its calendar. en-CA formats as YYYY-MM-DD
const nyDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
});

export const toNyDate = (epochMs) => nyDateFormat.format(new Date(epochMs));
