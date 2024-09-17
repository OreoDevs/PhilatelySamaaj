import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button, Paper, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

// Theme creation (unchanged)
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
      fontSize: '3rem',
    },
    h3: {
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

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const AIStampDetector = () => {
  const [imageInfo, setImageInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => {
          setImageInfo({
            name: "Penny Black",
            year: 1840,
            country: "United Kingdom",
            description: "The world's first adhesive postage stamp used in a public postal system.",
            rarity: "Very rare",
            estimatedValue: "$3,000 - $5,000"
          });
          setIsProcessing(false);
        }, 3000); // Simulate 3 seconds of processing
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', padding: 3 }}>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          AI Stamp Detector
        </Typography>
        
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Upload Your Stamp Image
              </Typography>
              <ImageContainer>
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded stamp" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <Typography variant="body1" color="textSecondary">No image uploaded</Typography>
                )}
              </ImageContainer>
              <StyledButton
                variant="contained"
                component="label"
                color="primary"
                fullWidth
              >
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
              </StyledButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Stamp Information
              </Typography>
              {isProcessing ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                  <Typography variant="body1" sx={{ ml: 2 }}>Processing image...</Typography>
                </Box>
              ) : imageInfo ? (
                <Box>
                  <Typography variant="body1"><strong>Name:</strong> {imageInfo.name}</Typography>
                  <Typography variant="body1"><strong>Year:</strong> {imageInfo.year}</Typography>
                  <Typography variant="body1"><strong>Country:</strong> {imageInfo.country}</Typography>
                  <Typography variant="body1"><strong>Description:</strong> {imageInfo.description}</Typography>
                  <Typography variant="body1"><strong>Rarity:</strong> {imageInfo.rarity}</Typography>
                  <Typography variant="body1"><strong>Estimated Value:</strong> {imageInfo.estimatedValue}</Typography>
                </Box>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Upload an image to see stamp information
                </Typography>
              )}
            </Grid>
          </Grid>
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
};

export default AIStampDetector;