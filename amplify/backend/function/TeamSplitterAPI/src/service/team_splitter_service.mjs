import { getAllPlayers } from "../repo/player_repo.mjs";
const team_colors = ['Red', 'Blue', 'Black', 'White'];

export const splitTeamsByPoll = async (poll, teamNum) => {
    const players = poll.answers.map((i) => i.player).filter((i) => i !== undefined)
    const playersMap = {};
    (await getAllPlayers()).Items.forEach((player) => {
        playersMap[player.id] = player;
    });
    //set current actual (at this moment) player scores
    players.forEach((player) => player.score = playersMap[player.id].score);

    return splitTeams(players, teamNum);
}

export const splitTeams = (players, teamNum) => {
  const sortedPlayers = players.sort((a,b) => b.score - a.score);
  
  const q = new PriorityQueue();
  
  const teams = [];
  for(let i = 0; i < teamNum; i++) {
    teams[i] = {name: team_colors[i], players: []};
    q.enqueue(teams[i].players, 0);
  }

  sortedPlayers.forEach((player) => {
    const elem = q.dequeue();
    elem.node.push(player);
    elem.priority = elem.priority + player.score;
    
    q.enqueue(elem.node, elem.priority);  
  });
  
  
  return teams;
}

export class PriorityQueue{
    constructor(){
        this.values = [];
    }
    
    enqueue(node, priority){
        let flag = false;
        const len = this.values.length;
        for(let i=0; i< len; i++){
            if(this.values[i].priority>priority){
                this.values.splice(i, 0, {node, priority})
                flag = true;
                break;
            }
        }
        if(!flag){
            this.values.push({node, priority})
        }
    }
    
    dequeue(){
        return this.values.shift()
    }
    
    size(){
        return this.values.length;
    }
}
