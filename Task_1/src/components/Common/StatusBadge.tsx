import { Chip, type ChipProps } from '@mui/material';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: 'Active' | 'Inactive';
}

export const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  return (
    <Chip
      label={status}
      color={status === 'Active' ? 'success' : 'default'}
      size="small"
      variant="outlined"
      {...props}
    />
  );
};
