import React from 'react';
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

const Footer = () => (
  <ThemeProvider theme={theme}>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '2px dashed',
        borderColor: 'primary.main',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The National Philately Community is dedicated to bringing together stamp collectors from across India, providing a platform to discover, connect, and share our rich postal heritage.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Home | Catalog | Community Forum | Events | Contact Us
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@philatelycommunity.in
              <br />
              Phone: +91 123 456 7890
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </motion.div>
    </ThemeProvider>
);

export default Footer