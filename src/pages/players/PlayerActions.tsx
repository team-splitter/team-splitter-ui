import { Box, Button, CircularProgress, Fab, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { DataGrid, GridRowId, GridColDef, GridRenderCellParams, GridValueGetterParams, renderActionsCell } from '@mui/x-data-grid';
import { deletePlayer, getPlayerById } from '../../services/PlayerService';
import { Player } from '../../api/Player.types';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '@mui/material/Tooltip';
import ConfirmDialog from '../../components/ConfirmDialog';

type PlayerActionsProps = {
  params: GridRenderCellParams
  rowId: GridRowId
  setRowId: (rowId: GridRowId) => void
  showEditPage: (player: Player) => void
  onRemovePlayer: (playerId: number) => void
}

const PlayerActions = ({ params, rowId, showEditPage, onRemovePlayer }: PlayerActionsProps) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEditHandler = async (e: any) => {
    const playerId = params.row.id;
    const player = await getPlayerById(playerId);
    showEditPage(player);
  }

  const deletePlayerRecord = async () => {
    const playerId = params.row.id;
    await deletePlayer(playerId);
    onRemovePlayer(playerId);
  }

  
  return (
    <Box
      sx={{
        m: 1,
        position: 'relative',
      }}
    >
      <Tooltip title="Edit">
        <IconButton onClick={onEditHandler}>
          <CreateIcon /></IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton onClick={(e) => {setOpen(true)}}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        title="Delete Player?"
        open={open}
        setOpen={setOpen}
        onConfirm={deletePlayerRecord}
      >
        Are you sure you want to delete this player?
      </ConfirmDialog>

    </Box>
  );
};

export default PlayerActions;