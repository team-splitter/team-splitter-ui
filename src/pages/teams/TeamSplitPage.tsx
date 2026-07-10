import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Team } from "../../api/Team.types";
import { getPollTeamSplit, splitPollTeams } from "../../services/PollTeamSplitService";
import TeamCardList from "./TeamCardList";
import ErrorMessage from "components/layout/ErrorMessage";
import InlineLoading from "components/layout/InlineLoading";

type TeamSplitPageProps = {
    pollId: string
    refreshKey?: number
    onSplitSuccess?: () => void
}

const TeamSplitPage = ({ pollId, refreshKey, onSplitSuccess }: TeamSplitPageProps) => {
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [splitting, setSplitting] = useState(false);
    const [error, setError] = useState(null);
    const [teamsNum, setTeamsNum] = useState(2);
    const [splitStrategy, setSplitStrategy] = useState("TEAM_SCORE_BALANCE");
    const [playerUpdateKey, setPlayerUpdateKey] = useState(0);

    useEffect(() => {
        getPollTeamSplit(pollId, teamsNum, splitStrategy)
            .then((response) => {
                setTeams(response);
                setError(null);
            })
            .catch(err => {
                console.log(`Error getting content from Prosmic: ${JSON.stringify(err)}`);
                setError(err.message)
                setTeams(null)
            })
            .finally(() => setLoading(false))
    }, [pollId, teamsNum, splitStrategy, refreshKey, playerUpdateKey])

    const handleSplit = () => {
        setSplitting(true);
        splitPollTeams(pollId, teamsNum)
            .then((response) => {
                setTeams(response);
                setError(null);
                onSplitSuccess?.();
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setSplitting(false));
    };

    return (
        <Box>
            <ErrorMessage message={error && `There is a problem fetching the teams - ${error}`} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="teams-number-label">Teams Number</InputLabel>
                    <Select
                        labelId="teams-number-label"
                        id="teams-number-select"
                        label="Teams Number"
                        value={teamsNum.toString()}
                        onChange={(event: SelectChangeEvent) => {
                            setTeamsNum(Number(event.target.value));
                        }}
                    >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="split-strategy-label">Split Strategy</InputLabel>
                    <Select
                        labelId="split-strategy-label"
                        id="split-strategy-select"
                        label="Split Strategy"
                        value={splitStrategy}
                        onChange={(event: SelectChangeEvent) => {
                            setSplitStrategy(event.target.value);
                        }}
                    >
                        <MenuItem value={"TEAM_SCORE_BALANCE"}>TEAM_SCORE_BALANCE</MenuItem>
                        <MenuItem value={"BACK_AND_FORCE"}>BACK_AND_FORCE</MenuItem>
                        <MenuItem value={"CIRCULAR"}>CIRCULAR</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleSplit} variant="contained" disabled={splitting}>
                    {splitting ? 'Splitting...' : 'Split'}
                </Button>
            </Stack>

            {loading && <InlineLoading />}
            {teams &&
                <TeamCardList teams={teams} draggable={false} onPlayerUpdated={() => setPlayerUpdateKey(k => k + 1)} />
            }
        </Box>
    )
}

export default TeamSplitPage;
