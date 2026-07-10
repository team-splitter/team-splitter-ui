import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Poll } from "api/Poll.types";
import moment from "moment";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { getPolls, createPoll, deletePoll } from "services/PollService";
import ConfirmDialog from "components/ConfirmDialog";
import PageLayout from "components/layout/PageLayout";
import PageHeader from "components/layout/PageHeader";
import ErrorMessage from "components/layout/ErrorMessage";
import DataTable from "components/layout/DataTable";
import InlineLoading from "components/layout/InlineLoading";


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
        { field: 'id', headerName: 'ID', width: 220 },
        {
            field: 'question',
            headerName: 'Question',
            flex: 1,
            minWidth: 240,
            editable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'createdAt',
            headerName: 'Creation Time',
            width: 180,
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
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Tooltip title="View">
                        <IconButton size="small" component={Link} to={`/poll/${params.row.id}`}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(params.row.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }
    ];

    return (
        <PageLayout>
            <PageHeader
                title="Polls"
                subtitle="Create and manage pickup-game polls"
                action={
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <TextField
                            label="Poll name"
                            value={pollName}
                            onChange={(e) => setPollName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreatePoll()}
                            sx={{ width: 260 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreatePoll}
                            disabled={!pollName.trim() || creating}
                        >
                            Create Poll
                        </Button>
                    </Box>
                }
            />
            <ErrorMessage message={error && `There is a problem fetching the poll data - ${error}`} />
            {loading && <InlineLoading/>}

            {!loading && data &&
                <DataTable
                    rows={data}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    page={page}
                    onPageChange={setPage}
                    rowCount={totalElements}
                    paginationMode="server"
                    experimentalFeatures={{ newEditingApi: true }}
                />
            }
            <ConfirmDialog
                title="Delete Poll"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleDeleteConfirm}
            >
                Are you sure you want to delete this poll? This will also close it in Telegram.
            </ConfirmDialog>
        </PageLayout>
    )
}

export default PollsPage;