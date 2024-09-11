const splits = [
    {
        teams: [
            {
                players: [
                    {
                        id: 1,
                        name: 'max'
                    }
                ]
            },
            {
                players: [
                    {
                        id: 2,
                        name: 'alex'
                    }
                ]
            }
        ]
    }, 
    {
        teams: [
            {
                players: [
                    {
                        id: 1,
                        name: 'max'
                    }
                ]
            },
            {
                players: [
                    {
                        id: 3,
                        name: 'serg'
                    }
                ]
            }
        ]
    },
    {
        teams: [
            {
                players: [
                    {
                        id: 1,
                        name: 'max'
                    }
                ]
            },
            {
                players: [
                    {
                        id: 3,
                        name: 'serg'
                    }
                ]
            }
        ]
    }
]

const stats = {};

for(let split of splits) {
  
  for(let team of split.teams) {
    for (let player of team.players) {
      if (!stats[player.id]) {
        let stat = {
            "games": 0,
            "days": 0
          };
        stats[player.id] = stat;
      } 
      
      const playerStat = stats[player.id];
      playerStat.days = playerStat.days + 1;

    }
  }
}

console.log(`stats =${JSON.stringify(stats)}`);