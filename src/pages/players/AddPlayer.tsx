import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Player } from "../../api/Player.types";
import { createPlayer, updatePlayer } from "../../services/PlayerService";

type AddPlayerProps = {
    player: Player | null
    mode: 'add' | 'edit'
    cancelButtonHandler: (e: any) => void
}

export const AddPlayer = ({ cancelButtonHandler, player, mode }: AddPlayerProps) => {
    const [id] = useState<string>(`${player?.id}`);
    const [firstName, setFirstName] = useState(`${player?.firstName}`);
    const [lastName, setLastName] = useState(`${player?.lastName}`);
    const [score, setScore] = useState(`${player?.score}`);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmitButtonHandler = async (e: any) => {
        e.preventDefault();
        const playerId = Number(id);
        const data: Player = {
            id: playerId,
            firstName: firstName,
            lastName: lastName,
            score: Number(score)
        }
        setSaving(true);
        setError(null);
        try {
            if (mode === 'add') {
                await createPlayer(data);
            } else {
                await updatePlayer(id, data);
            }
        } catch (err: any) {
            setError(err?.message || 'Could not save the player');
            setSaving(false);
            return;
        }

        cancelButtonHandler(e);
    }

    return (
        <Box component="form" onSubmit={onSubmitButtonHandler} sx={{ p: 3, width: 360, maxWidth: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {mode === 'add' ? 'Add Player' : 'Edit Player'}
            </Typography>
            <Stack spacing={2}>
                <TextField label="ID" value={id} disabled fullWidth />
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    autoFocus
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Score"
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    fullWidth
                />
            </Stack>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 3 }}>
                <Button onClick={cancelButtonHandler} color="inherit">Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? 'Saving…' : mode === 'add' ? 'Add' : 'Update'}
                </Button>
            </Stack>
        </Box>
    )
}

export default AddPlayer;
