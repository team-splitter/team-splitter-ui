import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Team } from "../../api/Team.types";
import { getPollTeamSplit } from "../../services/PollTeamSplitService";
import TeamCardList from "./TeamCardList";

type TeamSplitPageProps = {
    pollId: string
}

const TeamSplitPage = ({ pollId }: TeamSplitPageProps) => {
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamsNum, setTeamsNum] = useState(2);
    const [splitStrategy, setSplitStrategy] = useState("TEAM_SCORE_BALANCE");

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
    }, [teamsNum, splitStrategy])

    return (
        <div>
            <h1>Team Split</h1>
            {loading && <div> A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the teams - ${error}`}</div>
            )}

            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="teams-number-label">Teams Number</InputLabel>
                <Select
                    labelId="teams-number-label"
                    id="teams-number-select"
                    value={teamsNum.toString()}
                    onChange={(event: SelectChangeEvent) => {
                        setTeamsNum(Number(event.target.value));
                    }}
                >
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                </Select>

            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="split-strategy-label">Split Strategy</InputLabel>
                <Select
                    labelId="split-strategy-label"
                    id="split-strategy-select"
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
            {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <Button onClick={()=> {teamSplit();}} variant="contained">Split</Button>
            </FormControl> */}
            {teams &&
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TeamCardList teams={teams} />
                </Box>
            }
        </div>
    )
}

export default TeamSplitPage;