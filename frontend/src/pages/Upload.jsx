import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  CssBaseline,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.background.paper,
  boxShadow: '0 8px 32px 0 rgba(139, 69, 19, 0.37)',
  borderRadius: '15px',
  border: '1px solid rgba(218, 165, 32, 0.18)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}33`,
}));

function PhilatelicItemUpload() {
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemCondition, setItemCondition] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [userId, setUserId] = useState('');
  const [catalogNumber, setCatalogNumber] = useState('');
  const [denomination, setDenomination] = useState('');
  const [yearOfIssue, setYearOfIssue] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [certificateOfAuthenticity, setCertificateOfAuthenticity] = useState(false);
  const [expertVerification, setExpertVerification] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      const url = URL.createObjectURL(file);
      setImageURL(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let itemPicURL = '';
    if (itemImage) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `philatelic_items/${Date.now()}_${itemImage.name}`);

      try {
        await uploadBytes(storageRef, itemImage);
        itemPicURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    try {
      const db = getFirestore(app);
      const itemData = {
        itemName,
        itemCategory,
        itemCondition,
        itemPrice,
        itemPicURL,
        description,
        acquisitionDate: new Date(acquisitionDate),
        collectionLocation,
        userId,
        catalogNumber,
        denomination,
        yearOfIssue,
        countryOfOrigin,
        certificateOfAuthenticity,
        expertVerification,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'philatelicItems'), itemData);
      alert('Philatelic item uploaded successfully');

      // Reset form fields
      setItemName('');
      setItemCategory('');
      setItemCondition('');
      setItemPrice('');
      setItemImage(null);
      setImageURL('');
      setDescription('');
      setAcquisitionDate('');
      setCollectionLocation('');
      setCatalogNumber('');
      setDenomination('');
      setYearOfIssue('');
      setCountryOfOrigin('');
      setCertificateOfAuthenticity(false);
      setExpertVerification(false);
    } catch (error) {
      console.error('Error uploading item:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper>
            <Typography component="h1" variant="h4" sx={{ fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>
              Upload Your Philatelic Item
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="itemName"
                    label="Item Name"
                    name="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="item-category-label">Item Category</InputLabel>
                    <Select
                      labelId="item-category-label"
                      id="itemCategory"
                      value={itemCategory}
                      label="Item Category"
                      onChange={(e) => setItemCategory(e.target.value)}
                    >
                      <MenuItem value="stamps">Stamps</MenuItem>
                      <MenuItem value="covers">Covers</MenuItem>
                      <MenuItem value="postmarks">Postmarks</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="itemCondition"
                    label="Item Condition"
                    name="itemCondition"
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="itemPrice"
                    label="Item Price (₹)"
                    name="itemPrice"
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="catalogNumber"
                    label="Catalog Number"
                    name="catalogNumber"
                    value={catalogNumber}
                    onChange={(e) => setCatalogNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="denomination"
                    label="Denomination"
                    name="denomination"
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="yearOfIssue"
                    label="Year of Issue"
                    name="yearOfIssue"
                    type="number"
                    value={yearOfIssue}
                    onChange={(e) => setYearOfIssue(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="countryOfOrigin"
                    label="Country of Origin"
                    name="countryOfOrigin"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    label="Item Description"
                    name="description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="acquisitionDate"
                    label="Date of Acquisition"
                    name="acquisitionDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="collectionLocation"
                    label="Collection Location"
                    name="collectionLocation"
                    value={collectionLocation}
                    onChange={(e) => setCollectionLocation(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="itemImage"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="itemImage">
                    <Button variant="contained" component="span">
                      Upload Image
                    </Button>
                  </label>
                  {imageURL && (
                    <Box mt={2}>
                      <img src={imageURL} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={certificateOfAuthenticity} onChange={(e) => setCertificateOfAuthenticity(e.target.checked)} />}
                    label="Certificate of Authenticity Available"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={expertVerification} onChange={(e) => setExpertVerification(e.target.checked)} />}
                    label="Expert Verification Available"
                  />
                </Grid>
              </Grid>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Upload Philatelic Item
              </StyledButton>
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}

export default PhilatelicItemUpload;