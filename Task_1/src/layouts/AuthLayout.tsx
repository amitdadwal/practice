import { Box, Grid, Typography, alpha, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side - Branding/Hero (hidden on mobile) */}
      <Grid
        size={{ xs: 12, md: 5, lg: 4 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <DashboardIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              AdminPro
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 400 }}>
            The complete customer management solution for modern teams.
          </Typography>
        </Box>
        {/* Decorative background circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.common.white, 0.05),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.common.white, 0.05),
          }}
        />
      </Grid>

      {/* Right side - Auth Form */}
      <Grid
        size={{ xs: 12, md: 7, lg: 8 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 3, sm: 6, md: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
};
