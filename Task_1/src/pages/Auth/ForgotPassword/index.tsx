import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Typography, Box, Paper, Alert, Link as MuiLink, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '../../../schemas/authSchemas';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../constants/routeConstants';
import { useState } from 'react';
import { useToast } from '../../../components/Common/ToastProvider';

export const ForgotPassword = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      setStatus('idle');
      await authService.forgotPassword(data.email);
      setStatus('success');
      showToast('Password reset link sent to your email.', 'success');
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to send reset link';
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 4, sm: 6 }, width: '100%' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom color="text.primary">
          Forgot Password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your email and we'll send you a reset link.
        </Typography>
      </Box>

      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          If an account exists, a password reset link has been sent to your email.
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
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 4, mb: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <MuiLink component={Link} to={ROUTES.LOGIN} underline="hover" color="primary" variant="body2" sx={{ fontWeight: 500 }}>
            Back to Sign In
          </MuiLink>
        </Box>
      </Box>
    </Paper>
  );
};
