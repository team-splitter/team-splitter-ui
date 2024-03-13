import { Team, GameSplit } from "../../api/Team.types";
import TeamCard from "./TeamCard";

type TeamCardListProps = {
    teams: Team []
    gameSplit?: GameSplit
}

export const TeamCardList = ({teams, gameSplit}: TeamCardListProps) => {
    return (
        <div>
            {teams.map((team) => {
                return (
                    <TeamCard key={team.name} team={team} gameSplit={gameSplit}/>
                )
            })}
        </div>
    )
}

export default TeamCardList;