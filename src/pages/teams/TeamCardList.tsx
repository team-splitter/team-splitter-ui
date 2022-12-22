import { Team } from "../../api/Team.types";
import TeamCard from "./TeamCard";

type TeamCardListProps = {
    teams: Team []
}

export const TeamCardList = ({teams}: TeamCardListProps) => {
    return (
        <div>
            {teams.map((team) => {
                return (
                    <TeamCard key={team.name} team={team}/>
                )
            })}
        </div>
    )
}

export default TeamCardList;