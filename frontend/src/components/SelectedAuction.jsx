import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button, Paper, TextField, Snackbar } from '@mui/material';
import { styled } from '@mui/system';

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
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3.5rem',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem',
    },
    h5: { fontSize: '1.5rem' },
    body1: { fontSize: '1.1rem' },
    body2: { fontSize: '1rem' },
  },
  shape: { borderRadius: 8 },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StampImage = styled('img')({
  width: '100%',
  maxHeight: 400,
  objectFit: 'contain',
});

const SelectedAuction = ({ auctionId, onBackToList }) => {
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    // In a real application, you would fetch the auction data from an API
    // For this example, we'll use mock data
    const mockAuction = {
      id: auctionId,
      name: "Penny Black",
      description: "The world's first adhesive postage stamp, United Kingdom, 1840. This iconic stamp features a profile of Queen Victoria and was issued on May 1, 1840. It revolutionized the postal system and set the standard for stamp designs worldwide.",
      currentBid: 5000,
      timeLeft: 300,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Penny_black.jpg/220px-Penny_black.jpg",
      startingPrice: 4000,
      bidIncrement: 100,
      history: [
        { bidder: "JohnDoe", amount: 4000, time: "2023-09-15T10:00:00Z" },
        { bidder: "JaneSmith", amount: 4500, time: "2023-09-15T10:05:00Z" },
        { bidder: "BobJohnson", amount: 5000, time: "2023-09-15T10:10:00Z" },
      ]
    };

    setAuction(mockAuction);

    const timer = setInterval(() => {
      setAuction(prevAuction => ({
        ...prevAuction,
        timeLeft: Math.max(0, prevAuction.timeLeft - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBid = () => {
    const bidValue = Number(bidAmount);
    if (bidValue > auction.currentBid) {
      setAuction(prevAuction => ({
        ...prevAuction,
        currentBid: bidValue,
        history: [
          { bidder: "You", amount: bidValue, time: new Date().toISOString() },
          ...prevAuction.history
        ]
      }));
      setSnackbar({ open: true, message: 'Bid placed successfully!' });
      setBidAmount('');
    } else {
      setSnackbar({ open: true, message: 'Bid must be higher than current bid.' });
    }
  };

  if (!auction) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', padding: 3 }}>
        <Button onClick={onBackToList} variant="outlined" sx={{ mb: 2 }}>
          Back to Auctions
        </Button>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          {auction.name}
        </Typography>
        <StyledPaper elevation={3}>
          <StampImage src={auction.image} alt={auction.name} />
          <Typography variant="body1" sx={{ mt: 2 }}>{auction.description}</Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Current Bid: ${auction.currentBid.toLocaleString()}
          </Typography>
          <Typography variant="body1" color={auction.timeLeft < 60 ? 'error' : 'initial'}>
            Time Left: {formatTime(auction.timeLeft)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Your Bid"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBid}
              disabled={auction.timeLeft === 0}
            >
              Place Bid
            </Button>
          </Box>
          <Typography variant="h5" sx={{ mt: 3 }}>Bid History</Typography>
          {auction.history.map((bid, index) => (
            <Typography key={index} variant="body2">
              {bid.bidder}: ${bid.amount.toLocaleString()} at {new Date(bid.time).toLocaleString()}
            </Typography>
          ))}
        </StyledPaper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </ThemeProvider>
  );
};

export default SelectedAuction;