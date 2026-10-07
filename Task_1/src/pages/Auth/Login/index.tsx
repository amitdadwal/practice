import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Typography, Box, Paper, Alert, Link as MuiLink, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginSchema } from '../../../schemas/authSchemas';
import { loginSchema } from '../../../schemas/authSchemas';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routeConstants';
import { useState } from 'react';
import { useToast } from '../../../components/Common/ToastProvider';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        try {
            setError(null);
            await login(data);
            showToast('Successfully logged in', 'success');
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Login failed';
            setError(errorMsg);
            showToast(errorMsg, 'error');
        }
    };

    return (
        <Paper elevation={2} sx={{ p: { xs: 4, sm: 6 }, width: '100%' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom color="text.primary">
                    Welcome back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Please enter your details to sign in.
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 3 }}>
                    <MuiLink component={Link} to={ROUTES.FORGOT_PASSWORD} underline="hover" color="primary" variant="body2" sx={{ fontWeight: 500 }}>
                        Forgot password?
                    </MuiLink>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Box>
        </Paper>
    );
};
