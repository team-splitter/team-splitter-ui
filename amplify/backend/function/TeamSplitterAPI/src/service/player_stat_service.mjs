import {getSplitsByDates} from "../repo/game_split_repo.mjs";

export const getPlayerStats = async (fromDate, toDate) => {
    const splits = (await getSplitsByDates(fromDate, toDate)).Items.filter((split) => split.games);
    
    console.log(`count splits=${splits.length}`);
    
    const stats = {};
    
    for(let split of splits) {
      const teamMap = {};
      for(let team of split.teams) {
        const players = team.players.filter((player) => player.id); //filter deleted players
        teamMap[team.name] = players;
        
        for (let player of players) {
          if (!stats[player.id]) {
            let stat = {
                "firstName": player.firstName,
                "lastName": player.lastName,
                "wins": 0,
                "losses": 0,
                "draws": 0,
                "games": 0,
                "days": 0
              };
            stats[player.id] = stat;
          } 
          
          const playerStat = stats[player.id];
          playerStat.days++;
  
        }
      }
      
      for(let game of split.games) {
        if (!game.teamOneName) continue; //when 4 games didn't have scores

        if(game.teamOneScored > game.teamTwoScored) {
          //teamOne wins
          for (let player of teamMap[game.teamOneName]) {
            stats[player.id].wins++;
          } 
          //teamTwo losses
          for (let player of teamMap[game.teamTwoName]) {
            stats[player.id].losses++;
          } 
        } else if (game.teamOneScored < game.teamTwoScored) {
          //teamOne losses
          for (let player of teamMap[game.teamOneName]) {
            stats[player.id].losses++;
          } 
          //teamTwo wins
          for (let player of teamMap[game.teamTwoName]) {
            stats[player.id].wins++;
          } 
        } else {
          //teamOne draws
          for (let player of teamMap[game.teamOneName]) {
            stats[player.id].draws++;
          } 
          //teamTwo draws
          for (let player of teamMap[game.teamTwoName]) {
            stats[player.id].draws++;
          } 
        }
        
        for (let player of teamMap[game.teamOneName]) {
          stats[player.id].games++;
        } 
        for (let player of teamMap[game.teamTwoName]) {
          stats[player.id].games++;
        } 
      }
    }
    
    const result = Object.keys(stats).map((key) => {
      const value = stats[key];
      return {
        playerId: parseInt(key),
        firstName: value.firstName ? value.firstName : '', 
        lastName: value.lastName? value.lastName : '',
        totalWin: value.wins,
        totalLoss: value.losses,
        totalDraw: value.draws,
        totalGames: value.games,
        totalDays: value.days
      }
      });
    
    return result;
  };
  