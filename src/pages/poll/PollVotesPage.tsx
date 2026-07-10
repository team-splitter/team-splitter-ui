import { Autocomplete, Box, Button, Dialog, IconButton, Link as MuiLink, List, ListItem, ListItemText, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Player } from "api/Player.types"
import { Poll, PollVote } from "api/Poll.types"
import { getPlayers } from "services/PlayerService"
import { addPollVote, getVotesForPoll, deletePollVote } from "services/PollService"
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'components/ConfirmDialog';
import AddPlayer from "pages/players/AddPlayer";

type Props = {
    poll: Poll
    pollId: string
    onVoteChange?: () => void
}

export const PollVotesPage = ({ pollId, poll, onVoteChange }: Props) => {
    const [votes, setVotes] = useState(poll.answers as PollVote[]);
    const [players, setPlayers] = useState([] as Player[]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null> (null);
    const [addPlayerEnabled, setAddPlayerButtonEnabled] = useState(false);
    const [selectedVote, setSelectedVote] = useState<PollVote>({} as PollVote);
    const [editPlayer, setEditPlayer] = useState<Player | null>(null);

    const handleAddPlayer = async (e: any) => {
        e.preventDefault();
        if (selectedPlayer !== null) {
            const vote = await addPollVote(pollId, selectedPlayer.id);
            setVotes([...votes, vote]);
            onVoteChange?.();
        }
    }

    const onDeletePlayerVote = async (voteToRemove: PollVote) => {
        await deletePollVote(pollId, voteToRemove.id);
        setVotes(votes.filter((vote) => vote.id !== voteToRemove.id));
        onVoteChange?.();
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
        <Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
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
                        setAddPlayerButtonEnabled(newValue !== null);
                        setSelectedPlayer(newValue);
                      }}
                    sx={{ width: 300 }}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Player"/>}
                />
                <Button disabled={!addPlayerEnabled} onClick={handleAddPlayer} variant="contained">Add Player Vote</Button>
            </Stack>

            <List disablePadding>
                {votes.map((vote) => (
                    <ListItem
                        key={vote.id}
                        divider
                        secondaryAction={
                            <Tooltip title="Delete">
                                <IconButton edge="end" onClick={() => { setOpen(true); setSelectedVote(vote); }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <ListItemText
                            primary={
                                vote.player
                                    ? <MuiLink component="button" underline="hover" sx={{ textAlign: "left" }} onClick={() => setEditPlayer(vote.player)}>{vote.player.firstName || ''} {vote.player.lastName || ''}</MuiLink>
                                    : <Typography color="text.secondary">deleted user</Typography>
                            }
                        />
                    </ListItem>
                ))}
                {votes.length === 0 && (
                    <Typography color="text.secondary" sx={{ py: 2 }}>No players going yet.</Typography>
                )}
            </List>
            <ConfirmDialog
                title="Delete Vote?"
                open={open}
                setOpen={setOpen}
                onConfirm={()=> onDeletePlayerVote(selectedVote)}
            >
                Are you sure you want to delete this player vote?
            </ConfirmDialog>

            <Dialog open={!!editPlayer} onClose={() => setEditPlayer(null)}>
                {editPlayer && (
                    <AddPlayer
                        mode="edit"
                        player={editPlayer}
                        cancelButtonHandler={() => {
                                setEditPlayer(null);
                                getVotesForPoll(pollId).then(setVotes);
                            }}
                    />
                )}
            </Dialog>
        </Box>
    )
}