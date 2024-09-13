import {getGameSplit, updateGameSplitWithGames, } from '../repo/game_split_repo.mjs';
import { updatePlayerScoreWithPoints } from '../repo/player_repo.mjs';
export const setGameSplitScores = async (id, requestJSON) => {
    const games = requestJSON.map((item) => {
        return {
          teamOneName: item.teamOneName,
          teamTwoName: item.teamTwoName,
          teamOneScored: item.teamOneScored,
          teamTwoScored: item.teamTwoScored,
          createdAt: Date.now()
        }
      });

    await updateGameSplitWithGames(id, games); //set games in game split

    //update player scores
    const gameSplit = (await getGameSplit(id)).Item;

    const teamPoints = {};

    games.forEach((game) => {
        if (!teamPoints[game.teamOneName]){
            teamPoints[game.teamOneName] = 0;
        }
        if (!teamPoints[game.teamTwoName]) {
            teamPoints[game.teamTwoName] = 0;
        }

        if (game.teamOneScored > game.teamTwoScored) {
            teamPoints[game.teamOneName]++;
            teamPoints[game.teamTwoName]--;
        } else if (game.teamOneScored < game.teamTwoScored) {
            teamPoints[game.teamOneName]--;
            teamPoints[game.teamTwoName]++;
        }
    });

    const teams = gameSplit.teams;

    const playerPoints = teams.map((team) => {
        return team.players.map((player) => {
            return {
                playerId: player.id,
                points: teamPoints[team.name]
            }
        })
    })
    .reduce((a,b)=>a.concat(b))
    .filter((playerPoint) => playerPoint.points !== 0);

    for (const playerPoint of playerPoints) {
        await updatePlayerScoreWithPoints(playerPoint.playerId, playerPoint.points);
    }
    
    return games;
}