import { Autocomplete, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { Player } from "api/Player.types"
import { PollVote } from "api/Poll.types"
import { getPlayers } from "services/PlayerService"
import { addPollVote, getVotesForPoll, deletePollVote } from "services/PollService"
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'components/ConfirmDialog';

type Props = {
    pollId: string
}

export const PollVotesPage = ({ pollId }: Props) => {
    const [votes, setVotes] = useState([] as PollVote[]);
    const [players, setPlayers] = useState([] as Player[]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null> (null);
    const [addPlayerEnabled, setAddPlayerButtonEnabled] = useState(false);

    const handleAddPlayer = async (e: any) => {
        e.preventDefault();
        if (selectedPlayer !== null) {
            const vote = await addPollVote(pollId, selectedPlayer.id);
            setVotes([...votes, vote]);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onDeletePlayerVote = async (voteToRemove: PollVote) => {
        await deletePollVote(pollId, voteToRemove.id);
        setVotes(votes.filter((vote) => vote.id !== voteToRemove.id));

    }

    useEffect(() => {
        getVotesForPoll(pollId)
            .then((data) => {
                setVotes(data);
            })
    }, []);

    useEffect(() => {
        getPlayers()
            .then(data => {
                setPlayers(data);
            }).catch(response => {
                setError(response.message);
            })
    }, []);

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200}}>             
               <Autocomplete
                    options={players}
                    getOptionLabel={option=> option.firstName + ' ' + option.lastName}
                    value={selectedPlayer}
                    onChange={(event: any, newValue: Player | null) => {
                        if (newValue !== null) {
                            setAddPlayerButtonEnabled(true);
                        } else {
                            setAddPlayerButtonEnabled(false);
                        }
                        setSelectedPlayer(newValue);
                      }}
                    sx={{ width: 300 }}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Player"/>}
                />
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <Button disabled={!addPlayerEnabled} onClick={handleAddPlayer} variant="contained">Add Player Vote</Button>
            </FormControl>
            <FormControl>
                
            </FormControl>

            <h1>Players Going</h1>
            <ol>
                {votes.map((vote) => {
                    return (
                        <li key={vote.id}>{vote.player.firstName} {vote.player.lastName}
                            <Tooltip title="Delete">
                                <IconButton onClick={(e) => { setOpen(true) }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            <ConfirmDialog
                                title="Delete Vote?"
                                open={open}
                                setOpen={setOpen}
                                onConfirm={()=> onDeletePlayerVote(vote)}
                            >
                                Are you sure you want to delete this player vote?
                            </ConfirmDialog>
                        </li>
                    )
                })}
            </ol>

        </div>
    )
}