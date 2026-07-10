import React from "react";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
    title: string,
    children: any,
    open: boolean,
    setOpen: (val: boolean) => void,
    onConfirm: () => void
}

const ConfirmDialog = (props: Props) => {
  const { title, children, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
    >
      <DialogTitle id="confirm-dialog" sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={() => setOpen(false)}
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;