import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button, Grid, Paper, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
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
  height: 200,
  objectFit: 'contain',
});

// Predefined stamp data
const initialStamps = [
  {
    id: 1,
    name: "Penny Black",
    description: "The world's first adhesive postage stamp, United Kingdom, 1840",
    currentBid: 5000,
    timeLeft: 300,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Penny_black.jpg/220px-Penny_black.jpg"
  },
  {
    id: 2,
    name: "Inverted Jenny",
    description: "Famous U.S. misprint stamp, 1918",
    currentBid: 10000,
    timeLeft: 600,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Inverted_Jenny_24c_1918_issue.jpg/220px-Inverted_Jenny_24c_1918_issue.jpg"
  },
  {
    id: 3,
    name: "British Guiana 1c Magenta",
    description: "The world's rarest and most valuable stamp, 1856",
    currentBid: 8000000,
    timeLeft: 900,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/British_Guiana_1c_magenta.jpg/220px-British_Guiana_1c_magenta.jpg"
  }
];

const CurrentAuctions = ({ onSelectAuction }) => {
  const [stamps, setStamps] = useState(initialStamps);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setStamps(prevStamps =>
        prevStamps.map(stamp => ({
          ...stamp,
          timeLeft: Math.max(0, stamp.timeLeft - 1)
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredStamps = stamps.filter(stamp => 
    stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stamp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', padding: 3 }}>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          Current Auctions
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search auctions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Grid container spacing={3}>
          {filteredStamps.map((stamp) => (
            <Grid item xs={12} sm={6} md={4} key={stamp.id}>
              <StyledPaper elevation={3}>
                <StampImage src={stamp.image} alt={stamp.name} />
                <Typography variant="h5">{stamp.name}</Typography>
                <Typography variant="body2">{stamp.description}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Current Bid: ${stamp.currentBid.toLocaleString()}
                </Typography>
                <Typography variant="body1" color={stamp.timeLeft < 60 ? 'error' : 'initial'}>
                  Time Left: {formatTime(stamp.timeLeft)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => onSelectAuction(stamp.id)}
                  disabled={stamp.timeLeft === 0}
                >
                  View Auction
                </Button>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default CurrentAuctions;