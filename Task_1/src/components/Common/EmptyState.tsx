import { Box, Typography, Button, type SvgIconProps } from '@mui/material';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactElement<SvgIconProps>;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon, title, description, actionText, onAction }: EmptyStateProps) => {
  return (
    <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {icon && (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '50%', mb: 2 }}>
          {React.cloneElement(icon, { sx: { fontSize: 48, color: 'text.disabled' } })}
        </Box>
      )}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.primary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="outlined" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
