import { Team, Game } from "../../api/Team.types";
import TeamCard from "./TeamCard";

type TeamCardListProps = {
    teams: Team []
    game?: Game
}

export const TeamCardList = ({teams, game}: TeamCardListProps) => {
    return (
        <div>
            {teams.map((team) => {
                return (
                    <TeamCard key={team.name} team={team} game={game}/>
                )
            })}
        </div>
    )
}

export default TeamCardList;