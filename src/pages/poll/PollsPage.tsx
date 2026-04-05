import React, { ReactElement, FC, useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { Poll } from "api/Poll.types";
import moment from "moment";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link, useParams } from "react-router-dom";
import { getPolls, createPoll, deletePoll } from "services/PollService";
import Loading from "components/Loading";
import ConfirmDialog from "components/ConfirmDialog";


function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

const PollsPage  = () => {
    const [data, setData] = useState<Poll[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);

    const [pollName, setPollName] = useState<string>("");
    const [creating, setCreating] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pollToDelete, setPollToDelete] = useState<string | null>(null);

    const handleDeleteClick = (pollId: string) => {
        setPollToDelete(pollId);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!pollToDelete) return;
        deletePoll(pollToDelete)
            .then(() => getPolls(page, pageSize))
            .then((actualData) => {
                setData(actualData.content);
                setTotalElements(actualData.totalElements);
            })
            .catch((err) => setError(err.message))
            .finally(() => setPollToDelete(null));
    };

    const handleCreatePoll = () => {
        if (!pollName.trim()) return;
        setCreating(true);
        createPoll(pollName.trim())
            .then(() => {
                setPollName("");
                return getPolls(page, pageSize);
            })
            .then((actualData) => {
                setData(actualData.content);
                setTotalElements(actualData.totalElements);
            })
            .catch((err) => setError(err.message))
            .finally(() => setCreating(false));
    };

    useEffect(() => {
        setLoading(true);
        getPolls(page, pageSize)
            .then((actualData) => {
                setData(actualData.content);
                setTotalElements(actualData.totalElements);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setData([]);
            })
            .finally(() => {
                setLoading(false)
            });
    }, [page, pageSize]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 300 },
        {
            field: 'question',
            headerName: 'Question',
            width: 600,
            editable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'createdAt',
            headerName: 'Creation Time',
            width: 200,
            editable: false,
            sortable: false,
            filterable: false,
            valueGetter: (params: GridValueGetterParams) => {
                return `${format(params.row.createdAt)}`
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Link to={`/poll/${params.row.id}`}>View</Link>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <div>
            <h1>Polls</h1>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                    label="Poll name"
                    value={pollName}
                    onChange={(e) => setPollName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePoll()}
                    size="small"
                    sx={{ width: 300 }}
                />
                <Button
                    variant="contained"
                    onClick={handleCreatePoll}
                    disabled={!pollName.trim() || creating}
                >
                    Create Poll
                </Button>
            </Box>
            {loading && <Loading/>}
            {error && (
                <div>{`There is a problem fetching the poll data - ${error}`}</div>
            )}

            {data &&
                <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <DataGrid
                        autoHeight
                        rows={data}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                        page={page}
                        onPageChange={setPage}
                        rowCount={totalElements}
                        paginationMode="server"
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        disableSelectionOnClick
                        showCellRightBorder
                        showColumnRightBorder
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            }
            <ConfirmDialog
                title="Delete Poll"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleDeleteConfirm}
            >
                Are you sure you want to delete this poll? This will also close it in Telegram.
            </ConfirmDialog>
        </div>
    )
}

export default PollsPage;