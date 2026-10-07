import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const Dashboard = () => {
  const metrics = [
    { title: 'Total Customers', value: '2,451', icon: <PeopleIcon color="primary" />, trend: '+12%' },
    { title: 'Active Subscriptions', value: '1,832', icon: <TrendingUpIcon color="secondary" />, trend: '+5%' },
    { title: 'Monthly Revenue', value: '$45,231', icon: <AttachMoneyIcon color="success" />, trend: '+18%' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="text.primary" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your customers today.
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={metric.title}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    {metric.title}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }} color="text.primary">
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                    {metric.trend}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Placeholder for future charts or recent activity */}
      <Card sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center', color: 'text.disabled' }}>
          <TrendingUpIcon sx={{ fontSize: 48 }} />
          <Typography variant="h6">Activity chart will appear here</Typography>
        </Stack>
      </Card>
    </Box>
  );
};

