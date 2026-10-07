import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Layout/Sidebar';
import { Header } from '../components/Layout/Header';

export const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for header */}
        <Outlet />
      </Box>
    </Box>
  );
};
