import { Autocomplete, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from "@mui/material"
import { useEffect, useState } from "react"
import { Player } from "api/Player.types"
import { Poll, PollVote } from "api/Poll.types"
import { getPlayers } from "services/PlayerService"
import { addPollVote, getVotesForPoll, deletePollVote } from "services/PollService"
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'components/ConfirmDialog';

type Props = {
    poll: Poll
    pollId: string
}

export const PollVotesPage = ({ pollId, poll }: Props) => {
    const [votes, setVotes] = useState(poll.answers as PollVote[]);
    const [players, setPlayers] = useState([] as Player[]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null> (null);
    const [addPlayerEnabled, setAddPlayerButtonEnabled] = useState(false);
    const [selectedVote, setSelectedVote] = useState<PollVote>({} as PollVote);

    const handleAddPlayer = async (e: any) => {
        e.preventDefault();
        if (selectedPlayer !== null) {
            const vote = await addPollVote(pollId, selectedPlayer.id);
            setVotes([...votes, vote]);
        }
    }

    const onDeletePlayerVote = async (voteToRemove: PollVote) => {
        await deletePollVote(pollId, voteToRemove.id);
        setVotes(votes.filter((vote) => vote.id !== voteToRemove.id));

    }

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
                    getOptionLabel={option=> `${option.firstName || ''} ${option.lastName || ''}`}
                    renderOption={(props, option) => {
                        return (
                          <li {...props} key={option.id}>
                            {`${option.firstName || ''} ${option.lastName || ''}`}
                          </li>
                        );
                      }}
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
                        <li key={vote.id}>{vote.player ? `${vote.player.firstName || ''} ${vote.player.lastName || ''}`: `deleted user`}
                            <Tooltip title="Delete">
                                <IconButton onClick={(e) => { 
                                    setOpen(true); 
                                    setSelectedVote(vote);
                                    }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            
                        </li>
                    )
                })}
                <ConfirmDialog
                        title="Delete Vote?"
                        open={open}
                        setOpen={setOpen}
                        onConfirm={()=> onDeletePlayerVote(selectedVote)}
                    >
                        Are you sure you want to delete this player vote?
                    </ConfirmDialog>
            </ol>

        </div>
    )
}