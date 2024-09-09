import { Team, GameSplit } from "../../api/Team.types";
import { Button, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Player } from "api/Player.types";
import { useEffect } from "react";
import { useState } from "react";
import ConfirmDialog from 'components/ConfirmDialog';
import { deleteGameSplitPlayerEntry } from "services/GameSplitService";

type TeamCardProps = {
    team: Team
    gameSplit?: GameSplit
}

const TeamCard = ({team, gameSplit}: TeamCardProps) => {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player>({} as Player);

    const onDeletePlayerEntry = async (gameId:string , player: Player) => {
        await deleteGameSplitPlayerEntry(gameId, player.id);
    }

    const totalTeamScore = team.players.map(p => p.score).reduce((acc, score) => acc + score, 0);

    return (
        <div style={{width: "400px", display:"block", float: "left"}}>
            <h1>{team.name}</h1>
            <ol>
                {team.players.map((player) => {
                    return (
                        <li key={player.id}>
                            {player.firstName} {player.lastName} {player.score}
                            {gameSplit &&
                                <Tooltip title="Delete">
                                    <IconButton onClick={async (e) => {
                                        setOpen(true); 
                                        setSelectedPlayer(player);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            
                        </li>
                    )
                })}
            </ol>
            <div>Team Score:<b>{totalTeamScore}</b></div>

            {gameSplit &&
                <ConfirmDialog
                            title="Delete Player from Game?"
                            open={open}
                            setOpen={setOpen}
                            onConfirm={()=> onDeletePlayerEntry(gameSplit.id, selectedPlayer)}
                        >
                            Are you sure you want to delete this player?
                        </ConfirmDialog>
            }
        </div>
    )
}

export default TeamCard;