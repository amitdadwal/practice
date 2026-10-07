import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Typography, Box, Paper, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resetPasswordSchema, type ResetPasswordSchema } from '../../../schemas/authSchemas';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../constants/routeConstants';
import { useState } from 'react';
import { useToast } from '../../../components/Common/ToastProvider';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      setStatus('idle');
      await authService.resetPassword(data.password);
      setStatus('success');
      showToast('Password reset successfully.', 'success');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 4, sm: 6 }, width: '100%' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom color="text.primary">
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please enter your new password.
        </Typography>
      </Box>

      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password reset successfully. Redirecting to login...
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Stack>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 4, mb: 2 }}
          disabled={isSubmitting || status === 'success'}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Box>
    </Paper>
  );
};
