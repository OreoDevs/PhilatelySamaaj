import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, IconButton, Popover, List, ListItem, ListItemText, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

// Create theme based on provided specifications
const theme = createTheme({
  palette: {
    primary: { main: '#8B4513' },
    secondary: { main: '#DAA520' },
    background: {
      default: '#FDF5E6',
      paper: '#FAEBD7',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 16,
  },
  shape: { borderRadius: 8 },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    "New stamp series released: 'Wonders of the World'",
    "Upcoming philatelic exhibition in New Delhi"
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'relative' }}>
        <IconButton onClick={handleClick} size="large">
          <StyledBadge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon color="primary" />
          </StyledBadge>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List sx={{ width: 300 }}>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification} />
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>
    </ThemeProvider>
  );
};

export default Notification;