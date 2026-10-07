import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { ROUTES } from '../../constants/routeConstants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
            AdminPro
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.875rem' }}>A</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Admin User</Typography>
          </Box>
          <Button color="inherit" variant="text" size="small" onClick={handleLogout} sx={{ color: 'text.secondary' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
