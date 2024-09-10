const text = "/split  a";

const tokens = text.split(/\s+/);

const teamNum = tokens.length > 1 && !isNaN(parseInt(tokens[1])) ? parseInt(tokens[1]) : 2;
console.log(tokens);

console.log(teamNum);