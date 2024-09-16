import React from 'react'
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Search, Notifications, AccountCircle } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown
    },
    secondary: {
      main: '#DAA520', // Goldenrod
    },
    background: {
      default: '#FDF5E6', // Old Lace
      paper: '#FAEBD7', // Antique White
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 16, // Increased base font size
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3.5rem', // Increased from default
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3rem', // Increased from default
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem', // Increased from default
    },
    h5: {
      fontSize: '1.5rem', // Increased from default
    },
    body1: {
      fontSize: '1.1rem', // Increased from default
    },
    body2: {
      fontSize: '1rem', // Increased from default
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const Header = () => (
  <ThemeProvider theme={theme}>
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          National Philately Community
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" sx={{ mr: 2 }}>Catalog</Button>
          <Button color="inherit" sx={{ mr: 2 }}>Community</Button>
          <Button color="inherit" sx={{ mr: 2 }}>Events</Button>
          <Search sx={{ mr: 2 }} />
          <Notifications sx={{ mr: 2 }} />
          <AccountCircle />
        </Box>
      </Toolbar>
    </AppBar>
  </motion.div>
  </ThemeProvider>
);
export default Header