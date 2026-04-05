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
    const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
    const [touchTargetTeam, setTouchTargetTeam] = useState<string | null>(null);

    const onDragStart = (player: Player, fromTeamName: string) => {
        dragState.current = { player, fromTeamName };
    };

    const applyDrop = async (toTeamName: string) => {
        const drag = dragState.current;
        dragState.current = null;
        setGhostPos(null);
        setTouchTargetTeam(null);

        if (!drag || !gameSplit || drag.fromTeamName === toTeamName) return;

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

    const onTouchMove = (x: number, y: number) => {
        setGhostPos({ x, y });
        let el: Element | null = document.elementFromPoint(x, y);
        while (el && !el.getAttribute('data-team-name')) {
            el = el.parentElement;
        }
        setTouchTargetTeam(el?.getAttribute('data-team-name') ?? null);
    };

    const onTouchDrop = (x: number, y: number) => {
        let el: Element | null = document.elementFromPoint(x, y);
        while (el && !el.getAttribute('data-team-name')) {
            el = el.parentElement;
        }
        const toTeamName = el?.getAttribute('data-team-name');
        if (toTeamName) {
            applyDrop(toTeamName);
        } else {
            dragState.current = null;
            setGhostPos(null);
            setTouchTargetTeam(null);
        }
    };

    const draggingPlayer = dragState.current?.player ?? null;

    return (
        <div style={{ position: "relative" }}>
            {teams.map((team) => (
                <TeamCard
                    key={team.name}
                    team={team}
                    gameSplit={gameSplit}
                    onDragStart={onDragStart}
                    onDrop={applyDrop}
                    onTouchMove={onTouchMove}
                    onTouchDrop={onTouchDrop}
                    isTouchDragTarget={touchTargetTeam === team.name}
                    draggingPlayer={draggingPlayer}
                />
            ))}

            {ghostPos && draggingPlayer && (
                <div style={{
                    position: "fixed",
                    left: ghostPos.x - 70,
                    top: ghostPos.y - 28,
                    background: "#1976d2",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    pointerEvents: "none",
                    zIndex: 9999,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                    fontSize: "14px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    transform: "scale(1.05)"
                }}>
                    {draggingPlayer.firstName} {draggingPlayer.lastName}
                </div>
            )}
        </div>
    );
}

export default TeamCardList;
