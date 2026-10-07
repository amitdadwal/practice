import { Drawer, Box, Typography, IconButton, Divider, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type Customer } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';

interface CustomerDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailsDrawer = ({ open, onClose, customer }: CustomerDetailsDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 400 }, p: 3 },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Customer Details
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {customer ? (
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {customer.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Email Address
            </Typography>
            <Typography variant="body1">
              {customer.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Company
            </Typography>
            <Typography variant="body1">
              {customer.company}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <StatusBadge status={customer.status} />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created Date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(customer.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Typography color="text.secondary">No customer selected.</Typography>
      )}
    </Drawer>
  );
};
