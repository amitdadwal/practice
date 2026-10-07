import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormValues } from '../../schemas/customerSchemas';
import { type Customer } from '../../types';

interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
  initialData?: Customer | null;
  isSubmitting?: boolean;
}

export const CustomerFormModal = ({ open, onClose, onSubmit, initialData, isSubmitting = false }: CustomerFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        company: initialData.company,
        status: initialData.status,
      });
    } else {
      reset({
        name: '',
        email: '',
        company: '',
        status: 'Active',
      });
    }
  }, [initialData, open, reset]);

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Company"
            {...register('company')}
            error={!!errors.company}
            helperText={errors.company?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            select
            label="Status"
            defaultValue={initialData?.status || 'Active'}
            {...register('status')}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
