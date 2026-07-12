import React, { ReactElement, FC, useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Player } from "../../api/Player.types";
import { GridColDef, GridRowId, GridCellEditCommitParams, GridToolbarContainer, GridPagination } from '@mui/x-data-grid';
import PlayerActions from "./PlayerActions";
import { getPlayers } from "../../services/PlayerService";
import PageLayout from "components/layout/PageLayout";
import PageHeader from "components/layout/PageHeader";
import ErrorMessage from "components/layout/ErrorMessage";
import DataTable from "components/layout/DataTable";
import InlineLoading from "components/layout/InlineLoading";

type Props = {
    showEditPage: (player: Player)=> void;
    showAddPlayerPage: (e: any) => void;
}
const PlayersTable: FC<any> = ({showEditPage, showAddPlayerPage}: Props): ReactElement => {
    const [players, setPlayers] = useState([] as Player[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowId, setRowId] = useState<GridRowId>({} as GridRowId);
    const [pageSize, setPageSize] = useState<number>(100);

    const onRemovePlayer = (playerId: number) => {
        setPlayers(players.filter((item) => item.id !== playerId));
    }

    useEffect(() => {
        getPlayers()
            .then((data) => {
                setPlayers(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setPlayers([]);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 120,
            editable: false,
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            flex: 1,
            minWidth: 120,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            flex: 1,
            minWidth: 120,
            editable: true,
        },
        {
            field: 'score',
            headerName: 'Score',
            width: 100,
            editable: true,

        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 110,
            align: 'left',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <PlayerActions {...{params, rowId, setRowId, showEditPage, onRemovePlayer}} />
            ),
        }
    ];

    return (
        <PageLayout>
            <PageHeader
                title="Players"
                subtitle="Manage the player roster and scores"
                action={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={showAddPlayerPage}>
                        Add Player
                    </Button>
                }
            />
            <ErrorMessage message={error && `There is a problem fetching the player data - ${error}`} />
            {loading && <InlineLoading/>}

            {!loading && players &&
                <DataTable
                    rows={players}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    experimentalFeatures={{ newEditingApi: true }}
                    initialState={{
                        sorting: {
                            sortModel: [{field: 'score', sort: 'desc'}]
                        }
                    }}
                    getRowId={(row) => row.id}
                    onCellEditCommit={(params: GridCellEditCommitParams) => {
                        setRowId(params.id);
                        }
                    }
                    components={{
                        Toolbar: () => (
                            <GridToolbarContainer sx={{ justifyContent: 'flex-end' }}>
                                <GridPagination />
                            </GridToolbarContainer>
                        ),
                    }}
                />
            }
        </PageLayout>
    )
}

export default PlayersTable;