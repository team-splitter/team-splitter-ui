import { Team } from "../../api/Team.types";

type TeamCardProps = {
    team: Team
}

const TeamCard = ({team}: TeamCardProps) => {
    return (
        <div style={{width: "400px", display:"block", float: "left"}}>
            <h1>{team.name}</h1>
            <ol>
                {team.players.map((player) => {
                    return (
                        <li key={player.id}>{player.firstName} {player.lastName} {player.score}</li>
                    )
                })}
            </ol>
        </div>
    )
}

export default TeamCard;