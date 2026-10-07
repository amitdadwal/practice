import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isProcessing = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={isProcessing ? undefined : onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isProcessing} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} disabled={isProcessing} color="error" variant="contained">
          {isProcessing ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
