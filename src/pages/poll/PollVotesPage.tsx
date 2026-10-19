import { Alert, Autocomplete, Box, Button, Dialog, IconButton, Link as MuiLink, List, ListItem, ListItemText, Stack, TextField, Tooltip, Typography, createFilterOptions } from "@mui/material"
import { useEffect, useState } from "react"
import { Player } from "api/Player.types"
import { Poll, PollVote } from "api/Poll.types"
import { getPlayers } from "services/PlayerService"
import { addPollVote, getVotesForPoll, deletePollVote } from "services/PollService"
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from 'components/ConfirmDialog';
import AddPlayer from "pages/players/AddPlayer";

// The first dropdown option: picking it opens the form for a new guest instead of selecting a player
type PlayerOption = Player & { createGuest?: boolean }
const filterPlayers = createFilterOptions<PlayerOption>();

// Negative so guests can't clash with a Telegram user id, and are counted as guests
// (no Telegram id) by the split message and players-by-game
const newGuest = (name: string): Player => {
    const [firstName = '', ...lastName] = name.trim().split(/\s+/);
    return {
        id: -(Math.floor(Math.random() * 1000000000) + 1),
        firstName,
        lastName: lastName.join(' '),
        score: 50
    };
}

type Props = {
    poll: Poll
    pollId: string
    onVoteChange?: () => void
}

export const PollVotesPage = ({ pollId, poll, onVoteChange }: Props) => {
    const [votes, setVotes] = useState(poll.answers as PollVote[]);
    const [players, setPlayers] = useState([] as Player[]);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null> (null);
    const [addPlayerEnabled, setAddPlayerButtonEnabled] = useState(false);
    const [selectedVote, setSelectedVote] = useState<PollVote>({} as PollVote);
    const [editPlayer, setEditPlayer] = useState<Player | null>(null);
    const [guest, setGuest] = useState<Player | null>(null);

    const handleAddPlayer = async (e: any) => {
        e.preventDefault();
        if (selectedPlayer !== null) {
            const vote = await addPollVote(pollId, selectedPlayer.id);
            setVotes([...votes, vote]);
            onVoteChange?.();
        }
    }

    const onGuestSaved = async (saved: Player) => {
        setPlayers((current) => [...current, saved]);
        try {
            const vote = await addPollVote(pollId, saved.id);
            setVotes((current) => [...current, vote]);
            onVoteChange?.();
        } catch (err: any) {
            setError(err?.message || 'The guest was created but could not be added to the poll');
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
                <Autocomplete<PlayerOption>
                    options={players}
                    filterOptions={(options, params) => [
                        { ...newGuest(params.inputValue), createGuest: true },
                        ...filterPlayers(options, params)
                    ]}
                    getOptionLabel={option=> `${option.firstName || ''} ${option.lastName || ''}`}
                    renderOption={(props, option) => {
                        if (option.createGuest) {
                            return (
                              <li {...props} key="create-guest">
                                <Typography color="primary" fontWeight={500}>
                                    {option.firstName ? `+ Create guest "${`${option.firstName} ${option.lastName}`.trim()}"` : '+ Create new guest'}
                                </Typography>
                              </li>
                            );
                        }
                        return (
                          <li {...props} key={option.id}>
                            {`${option.firstName || ''} ${option.lastName || ''}`}
                          </li>
                        );
                      }}
                    value={selectedPlayer}
                    onChange={(event: any, newValue: PlayerOption | null) => {
                        if (newValue?.createGuest) {
                            const { createGuest, ...player } = newValue;
                            // the dialog hides the rest of the page, so don't leave focus in the dropdown behind it
                            (document.activeElement as HTMLElement | null)?.blur();
                            setGuest(player);
                            setAddPlayerButtonEnabled(false);
                            setSelectedPlayer(null);
                            return;
                        }
                        setAddPlayerButtonEnabled(newValue !== null);
                        setSelectedPlayer(newValue);
                      }}
                    sx={{ width: 300 }}
                    size="small"
                    renderInput={(params) => <TextField {...params} label="Player"/>}
                />
                <Button disabled={!addPlayerEnabled} onClick={handleAddPlayer} variant="contained">Add Player Vote</Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Players Going: {votes.length}
            </Typography>

            <List disablePadding>
                {votes.map((vote, index) => (
                    <ListItem
                        key={vote.id}
                        divider
                        secondaryAction={
                            <Tooltip title="Delete">
                                <IconButton edge="end" color="error" onClick={() => { setOpen(true); setSelectedVote(vote); }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <Typography component="span" color="text.secondary" sx={{ minWidth: 28 }}>
                            {index + 1}.
                        </Typography>
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

            <Dialog open={!!guest} onClose={() => setGuest(null)}>
                {guest && (
                    <AddPlayer
                        mode="add"
                        title="Add Guest"
                        player={guest}
                        onSaved={onGuestSaved}
                        cancelButtonHandler={() => setGuest(null)}
                    />
                )}
            </Dialog>
        </Box>
    )
}