import React from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Grid, Paper, Button } from '@mui/material';
import Image3DViewer from '../components/Image3DViewer';

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
      fontSize: 16,
      h1: {
        fontFamily: '"Playfair Display", serif',
        fontSize: '3.5rem',
      },
      h2: {
        fontFamily: '"Playfair Display", serif',
        fontSize: '3rem',
      },
      h3: {
        fontFamily: '"Playfair Display", serif',
        fontSize: '2.5rem',
      },
      h5: {
        fontSize: '1.5rem',
      },
      body1: {
        fontSize: '1.1rem',
      },
      body2: {
        fontSize: '1rem',
      },
    },
  });

  const stamps = [
    { id: 1, name: "Penny Black", year: 1840, price: 100, image: "/Stamp1.png", auctionPrice: 80, endTime: "2024-09-30T15:00:00Z" },
    { id: 2, name: "Inverted Jenny", year: 1918, price: 500, image: "https://placehold.co/600x400", auctionPrice: 450, endTime: "2024-10-15T18:00:00Z" },
    { id: 3, name: "Mauritius Post Office", year: 1847, price: 1000, image: "https://placehold.co/600x400", auctionPrice: 900, endTime: "2024-10-05T12:00:00Z" },
    { id: 4, name: "Treskilling Yellow", year: 1855, price: 750, image: "https://placehold.co/600x400", auctionPrice: 700, endTime: "2024-09-25T20:00:00Z" },
  ];

const StampDetailPage = () => {
  const { id } = useParams();
  const stamp = stamps.find(s => s.id === parseInt(id));

  if (!stamp) {
    return <Typography>Stamp not found</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Stamp Details: {stamp.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h4" gutterBottom>{stamp.name}</Typography>
              <Typography variant="body1">Year: {stamp.year}</Typography>
              <Typography variant="body1">Buy Now Price: ${stamp.price}</Typography>
              <Typography variant="body1">Current Auction: ${stamp.auctionPrice}</Typography>
              <Typography variant="body1">Auction Ends: {new Date(stamp.endTime).toLocaleString()}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 1 }}>
                Buy Now
              </Button>
              <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
                Place Bid
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h5" gutterBottom>3D View</Typography>
              <Image3DViewer imageUrl={stamp.image} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default StampDetailPage;