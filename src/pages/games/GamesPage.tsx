import { IconButton, TextField, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { GameSplit, GameScore } from "api/Team.types";
import ConfirmDialog from "components/ConfirmDialog";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteGameSplitById, getGameSplits, setGameSplitScores } from "services/GameSplitService";
import DeleteIcon from '@mui/icons-material/Delete';
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import PageLayout from "components/layout/PageLayout";
import PageHeader from "components/layout/PageHeader";
import ErrorMessage from "components/layout/ErrorMessage";
import DataTable from "components/layout/DataTable";
import InlineLoading from "components/layout/InlineLoading";

function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

const twoTeamsScores = [{"teamOneName": "Red", "teamTwoName": "Blue", teamOneScored: 0, teamTwoScored: 0}];
const fourTeamScores = [
    {"teamOneName": "Red", "teamTwoName": "White", teamOneScored: 0, teamTwoScored: 0},
    {"teamOneName": "Blue", "teamTwoName": "Black", teamOneScored: 0, teamTwoScored: 0},
    {"teamOneName": "Red", "teamTwoName": "Black", teamOneScored: 0, teamTwoScored: 0},
    {"teamOneName": "Blue", "teamTwoName": "White", teamOneScored: 0, teamTwoScored: 0},
    {"teamOneName": "Red", "teamTwoName": "Blue", teamOneScored: 0, teamTwoScored: 0},
    {"teamOneName": "Black", "teamTwoName": "White", teamOneScored: 0, teamTwoScored: 0},
];


const GamesPage  = () => {
    const [gameSplits, setGameSplits] = useState<GameSplit[]>([]);
    const [gameSplitsCount, setGameSplitsCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState<string>('');
    const [openScore, setOpenScore] = useState(false);

    const [gameScores, setGameScores] = useState<GameScore[]>(twoTeamsScores);

    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);

    const onDeleteGame = async (gameId:string) => {
        await deleteGameSplitById(gameId);
        setGameSplits(gameSplits.filter(i => i.id !== gameId));
    }

    const onSaveGameScores = async (gameSplitId: string, gameScores: GameScore[] ) => {
        const games = await setGameSplitScores(gameSplitId, gameScores);
        const updatedGameSplits = gameSplits.map(i => {
            if (i.id === gameSplitId) {
                i.games = games;
            } 
            return i;
        });
        setGameSplits(updatedGameSplits);
    }


    const setGameScore = (newValue: string, teamName: string, index: number) => {
        const list = [...gameScores];
        if (newValue === "") newValue = "0"
        
        if (list[index].teamOneName == teamName){
            list[index].teamOneScored =  Number.parseInt(newValue);
        } else {
            list[index].teamTwoScored =  Number.parseInt(newValue);
        }
        
        setGameScores(list);
    }
    
    useEffect(() => {
        setLoading(true);
        getGameSplits(page, pageSize)
            .then((data) => {
                setGameSplits(data.content);
                setGameSplitsCount(data.totalElements);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setGameSplits([]);
                setGameSplitsCount(0);
            })
            .finally(() => {
                setLoading(false)
            });
    }, [page, pageSize]);

    const columns: GridColDef[] = [
        { 
            field: 'id',
            headerName: 'Split ID',
            width: 300,
            sortable: false,
            filterable: false,
        },
        {
            field: 'teamSize',
            headerName: 'Teams Size',
            width: 100,
            editable: false,
            sortable: false,
            filterable: false,
        },
        {
            field: 'gameScore',
            headerName: 'Game Score',
            width: 300,
            renderCell: (params: GridRenderCellParams<any, GameSplit>) => (
                <div>
                    {(!params.row.games || params.row.games.length == 0 || params.row.games[0].teamTwoName == null) &&
                        <span>N/A</span>
                    }

                    {params.row.games && params.row.games.length >0 && params.row.games[0].teamOneName != null &&
                        <ol>
                            {params.row.games.map((game) => {
                                return (
                                    <li key={game.id}>
                                        <span>({game.teamOneName}) <b>{game.teamOneScored}:{game.teamTwoScored}</b> ({game.teamTwoName})</span>
                                    </li>
                                )
                            })}
                        </ol>
                    }
                    
                </div>
            ),
            sortable: false,
            filterable: false,
            editable: false,
        },
        {
            field: 'createdAt',
            headerName: 'Creation Time',
            width: 200,
            editable: false,
            sortable: false,
            filterable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${format(params.row.createdAt)}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 400,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<any, GameSplit>) => (
                <div>
                    <Tooltip title="Poll">
                        <IconButton component={Link} to={`/poll/${params.row.pollId}`}>
                            <PollRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton color="error" onClick={async (e) => {
                            setOpen(true);
                            setSelectedGameId(params.row.id);
                            }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    {(!params.row.games || params.row.games.length == 0) &&
                        <Tooltip title="Set Score">
                            <IconButton onClick={async (e) => {
                                setOpenScore(true); 
                                setSelectedGameId(params.row.id);
                                setGameScores(params.row.teamSize == 2 ? twoTeamsScores : fourTeamScores);
                                }}>
                                <SportsScoreRoundedIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                </div>
                
            ),
        }
    ];

    return (
        <PageLayout>
            <PageHeader
                title="Game Splits"
                subtitle="Generated team splits and their scores"
            />
            <ErrorMessage message={error && `There is a problem fetching the game splits data - ${error}`} />
            {loading && <InlineLoading/>}

            {!loading && gameSplits &&
                <DataTable
                    getRowHeight={() => 'auto'}
                    rows={gameSplits}
                    columns={columns}
                    paginationMode="server"
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    page={page}
                    onPageChange={setPage}
                    rowCount={gameSplitsCount}
                />
            }

            {gameSplits &&
                <ConfirmDialog
                            title="Delete Game?"
                            open={open}
                            setOpen={setOpen}
                            onConfirm={()=> onDeleteGame(selectedGameId)}
                        >
                            Are you sure you want to delete game?
                        </ConfirmDialog>
            }

            {gameSplits && 
                <ConfirmDialog
                title="Set Game Score"
                open={openScore}
                setOpen={setOpenScore}
                onConfirm={()=> onSaveGameScores(selectedGameId, gameScores)}
            >
                <div>
                    <div>Specifiy Number of goals scored</div>
                    {gameScores.map((gameScore, i) => {
                        return (
                            <div key={i}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    type="number"
                                    label={`${gameScore.teamOneName} Scored`}
                                    value={gameScore.teamOneScored}
                                    onChange={(e) => setGameScore(e.target.value, gameScore.teamOneName, i)}
                                    inputProps={{min:0, max: 20}}
                                    margin="normal"
                                    style = {{width: 200}}
                                    />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label={`${gameScore.teamTwoName} Scored`}
                                    type="number"
                                    value={gameScore.teamTwoScored}
                                    onChange={(e) => setGameScore(e.target.value, gameScore.teamTwoName, i)}
                                    inputProps={{min:0, max: 20}}
                                    margin="normal"
                                    style = {{width: 200, paddingLeft: 5}}
                                    />
                            </div>
                        )
                    })}
                    
                </div>
            </ConfirmDialog>
            }
        </PageLayout>
    )
}

export default GamesPage;