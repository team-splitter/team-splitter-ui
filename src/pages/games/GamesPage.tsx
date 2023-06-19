import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Game } from "api/Team.types";
import ConfirmDialog from "components/ConfirmDialog";
import Loading from "components/Loading";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteGameById, getGames, setGameScore } from "services/GameService";
import DeleteIcon from '@mui/icons-material/Delete';
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded';

function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

const GamesPage  = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState<number>(0);
    const [openScore, setOpenScore] = useState(false);

    const [redScored, setRedScored] = useState<number>(0);
    const [blueScored, setBlueScored] = useState<number>(0);

    const onDeleteGame = async (gameId:number) => {
        await deleteGameById(gameId);
        setGames(games.filter(i => i.id !== gameId));
    }

    const onSetGameScore = async (gameId: number, redScored: number, blueScored: number) => {
        await setGameScore(gameId, redScored, blueScored);
        const updatedGames = games.map(i => {
            if (i.id === gameId) {
                i.redScored = redScored;
                i.blueScored = blueScored;
            } 
            return i;
        });
        setGames(updatedGames);
    }
    
    useEffect(() => {
        getGames()
            .then((data) => {
                setGames(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setGames([]);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Game ID', width: 100 },
        {
            field: 'teamSize',
            headerName: 'Teams Size',
            width: 100,
            editable: false,
        },
        {
            field: 'gameScore',
            headerName: 'Game Score',
            width: 300,
            renderCell: (params) => (
                <div>
                    {params.row.teamSize > 2 && 
                        <span>N/A</span>
                    } 
                    {params.row.teamSize == 2 && params.row.redScored !== null && params.row.blueScored !== null &&
                        <span>(Red) <b>{params.row.redScored}:{params.row.blueScored}</b> (Blue)</span>
                    }
                </div>
            ),
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            width: 200,
            editable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${format(params.row.creationTime)}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 400,
            renderCell: (params) => (
                <div>
                    <Link to={`/poll/${params.row.pollId}`}>Poll</Link>
                    <Tooltip title="Delete">
                        <IconButton onClick={async (e) => {
                            setOpen(true); 
                            setSelectedGameId(params.row.id);
                            }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    {params.row.teamSize == 2 && (params.row.redScored == null || params.row.blueScored == null) &&
                        <Tooltip title="Set Score">
                            <IconButton onClick={async (e) => {
                                setOpenScore(true); 
                                setSelectedGameId(params.row.id);
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
        <div>
            <h1>Games</h1>
            {loading && <Loading/>}
            {error && (
                <div>{`There is a problem fetching the games data - ${error}`}</div>
            )}

            {games &&
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <DataGrid
                        autoHeight
                        rows={games}
                        columns={columns}
                        pageSize={20}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        disableSelectionOnClick
                        showCellRightBorder
                        showColumnRightBorder
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'creationTime', sort: 'desc'}]
                            }
                        }}
                    />
                </Box>
            }

            {games &&
                <ConfirmDialog
                            title="Delete Game?"
                            open={open}
                            setOpen={setOpen}
                            onConfirm={()=> onDeleteGame(selectedGameId)}
                        >
                            Are you sure you want to delete game?
                        </ConfirmDialog>
            }

            {games && 
                <ConfirmDialog
                title="Set Game Score"
                open={openScore}
                setOpen={setOpenScore}
                onConfirm={()=> onSetGameScore(selectedGameId, redScored, blueScored)}
            >
                <div>
                    <div>Specifiy Number of goals scored</div>
                    <TextField
                        required
                        id="outlined-required"
                        label="Red Scored"
                        value={redScored}
                        onChange={(e) => setRedScored(Number.parseInt(e.target.value))}
                        />
                    <TextField
                        required
                        id="outlined-required"
                        label="Blue Scored"
                        value={blueScored}
                        onChange={(e) => setBlueScored(Number.parseInt(e.target.value))}
                        />
                </div>
            </ConfirmDialog>
            }
        </div>
    )
}

export default GamesPage;