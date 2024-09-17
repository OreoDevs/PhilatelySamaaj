import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Create theme based on the provided palette and typography
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
  
  const StampCard = ({ stamp, onBuy, onAuction, onViewDetails }) => (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={stamp.image}
        alt={stamp.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {stamp.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Year: {stamp.year}
        </Typography>
        <Typography variant="body1">
          Buy Now Price: ${stamp.price}
        </Typography>
        <Typography variant="body2">
          Current Auction: ${stamp.auctionPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Auction Ends: {new Date(stamp.endTime).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" color="primary" onClick={() => onBuy(stamp)}>
          Buy Now
        </Button>
        <Button size="small" variant="outlined" color="secondary" onClick={() => onAuction(stamp)}>
          Bid
        </Button>
        <Button size="small" color="info" onClick={() => onViewDetails(stamp.id)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
  
  const PhilatelicMarketplace = () => {
    const navigate = useNavigate();
  
    const handleBuy = (stamp) => {
      alert(`You are buying ${stamp.name} for $${stamp.price}`);
      // Implement buy logic here
    };
  
    const handleAuction = (stamp) => {
      alert(`You are bidding on ${stamp.name}. Current bid: $${stamp.auctionPrice}`);
      // Implement auction logic here
    };
  
    const handleViewDetails = (stampId) => {
      navigate(`/stamp/${stampId}`);
    };
  
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Philatelic Marketplace
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h2" gutterBottom>
            Rare Stamps Collection
          </Typography>
          <Grid container spacing={4}>
            {stamps.map((stamp) => (
              <Grid item key={stamp.id} xs={12} sm={6} md={4}>
                <StampCard 
                  stamp={stamp} 
                  onBuy={handleBuy} 
                  onAuction={handleAuction}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    );
  };
  
  export default PhilatelicMarketplace;