import { useState, useRef } from "react";
import { Team, GameSplit } from "../../api/Team.types";
import { Player } from "api/Player.types";
import TeamCard from "./TeamCard";
import { moveGameSplitPlayer } from "services/GameSplitService";

type TeamCardListProps = {
    teams: Team[]
    gameSplit?: GameSplit
}

export type DragState = {
    player: Player
    fromTeamName: string
}

export const TeamCardList = ({teams: initialTeams, gameSplit}: TeamCardListProps) => {
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const dragState = useRef<DragState | null>(null);

    const onDragStart = (player: Player, fromTeamName: string) => {
        dragState.current = { player, fromTeamName };
    };

    const onDrop = async (toTeamName: string) => {
        const drag = dragState.current;
        dragState.current = null;

        if (!drag || !gameSplit || drag.fromTeamName === toTeamName) return;

        // Optimistic update
        setTeams(prev => prev.map(team => {
            if (team.name === drag.fromTeamName) {
                return { ...team, players: team.players.filter(p => p.id !== drag.player.id) };
            }
            if (team.name === toTeamName) {
                return { ...team, players: [...team.players, drag.player] };
            }
            return team;
        }));

        try {
            const updated = await moveGameSplitPlayer(gameSplit.id, drag.player.id, drag.fromTeamName, toTeamName);
            setTeams(updated.teams);
        } catch (err) {
            console.error('Failed to move player', err);
            setTeams(initialTeams);
        }
    };

    return (
        <div>
            {teams.map((team) => (
                <TeamCard
                    key={team.name}
                    team={team}
                    gameSplit={gameSplit}
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                />
            ))}
        </div>
    );
}

export default TeamCardList;
