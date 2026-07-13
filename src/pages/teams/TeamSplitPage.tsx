import { Box, Button, FormControl, FormControlLabel, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { Team } from "../../api/Team.types";
import { getPollTeamSplit, splitPollTeams } from "../../services/PollTeamSplitService";
import TeamCardList from "./TeamCardList";
import { TEAM_COLORS, TEAM_COLOR_HEX, defaultTeamNames } from "./teamColors";
import ErrorMessage from "components/layout/ErrorMessage";
import InlineLoading from "components/layout/InlineLoading";

type TeamSplitPageProps = {
    pollId: string
    refreshKey?: number
    onSplitSuccess?: () => void
}

const ColorSwatch = ({ color }: { color: string }) => (
    <Box
        sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: TEAM_COLOR_HEX[color] ?? "transparent",
            border: "1px solid",
            borderColor: "divider",
        }}
    />
);

const TeamSplitPage = ({ pollId, refreshKey, onSplitSuccess }: TeamSplitPageProps) => {
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [splitting, setSplitting] = useState(false);
    const [error, setError] = useState(null);
    const [teamsNum, setTeamsNum] = useState(2);
    const [teamNames, setTeamNames] = useState<string[]>(defaultTeamNames(2));
    const [splitStrategy, setSplitStrategy] = useState("TEAM_SCORE_BALANCE");
    const [sendTelegram, setSendTelegram] = useState(true);
    const [playerUpdateKey, setPlayerUpdateKey] = useState(0);

    useEffect(() => {
        getPollTeamSplit(pollId, teamsNum, splitStrategy, teamNames)
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
    }, [pollId, teamsNum, splitStrategy, teamNames, refreshKey, playerUpdateKey])

    const handleTeamsNumChange = (event: SelectChangeEvent) => {
        const num = Number(event.target.value);
        setTeamsNum(num);
        setTeamNames(defaultTeamNames(num));
    };

    const handleTeamColorChange = (index: number, color: string) => {
        setTeamNames(prev => prev.map((name, i) => (i === index ? color : name)));
    };

    const handleSplit = () => {
        setSplitting(true);
        splitPollTeams(pollId, teamsNum, teamNames, sendTelegram)
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
                        onChange={handleTeamsNumChange}
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
                <FormControlLabel
                    control={<Switch checked={sendTelegram} onChange={(e) => setSendTelegram(e.target.checked)} />}
                    label="Send Telegram message"
                />
                <Button onClick={handleSplit} variant="contained" disabled={splitting}>
                    {splitting ? 'Splitting...' : 'Split'}
                </Button>
            </Stack>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                {teamNames.map((teamColor, index) => (
                    <FormControl key={index} size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id={`team-color-label-${index}`}>{`Team ${index + 1} color`}</InputLabel>
                        <Select
                            labelId={`team-color-label-${index}`}
                            id={`team-color-select-${index}`}
                            label={`Team ${index + 1} color`}
                            value={teamColor}
                            renderValue={(value) => (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ColorSwatch color={value} />
                                    <span>{value}</span>
                                </Stack>
                            )}
                            onChange={(event: SelectChangeEvent) => handleTeamColorChange(index, event.target.value)}
                        >
                            {TEAM_COLORS.map((color) => (
                                <MenuItem
                                    key={color}
                                    value={color}
                                    disabled={color !== teamColor && teamNames.includes(color)}
                                >
                                    <ColorSwatch color={color} />
                                    <ListItemText primary={color} sx={{ ml: 1 }} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ))}
            </Box>

            {loading && <InlineLoading />}
            {teams &&
                <TeamCardList teams={teams} draggable={false} onPlayerUpdated={() => setPlayerUpdateKey(k => k + 1)} />
            }
        </Box>
    )
}

export default TeamSplitPage;
