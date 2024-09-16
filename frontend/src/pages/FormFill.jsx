import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
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
  FormControlLabel,
  FormGroup
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

// List of Indian states for the dropdown
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function FormFill() {
  const [userType, setUserType] = useState('');
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [canSellStamps, setCanSellStamps] = useState(false);
  const [canSellCoins, setCanSellCoins] = useState(false);
  const [canSellNotes, setCanSellNotes] = useState(false);
  const [formFilled, setFormFilled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await db.collection('userDetails').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserType(userData.userType || '');
          setState(userData.state || '');
          setName(userData.name || '');
          setExperience(userData.experience || '');
          setContactDetails(userData.contactDetails || '');
          setCanSellStamps(userData.canSellStamps || false);
          setCanSellCoins(userData.canSellCoins || false);
          setCanSellNotes(userData.canSellNotes || false);
          setFormFilled(true);
          navigate('/myprofile');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      userType,
      state,
      experience,
      contactDetails,
      canSellStamps,
      canSellCoins,
      canSellNotes,
    };

    try {
      const user = auth.currentUser;
      if (user) {
        await db.collection('userDetails').doc(user.uid).set(formData, { merge: true });
        alert('Form submitted successfully!');
        navigate('/myprofile');
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert('Failed to submit form.');
    }
  };

  if (formFilled) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Redirecting to your profile...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper>
            <Typography component="h1" variant="h4" sx={{ fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>
              Fill in your details
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="experience"
                    label="Experience"
                    name="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      id="state"
                      value={state}
                      label="State"
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>Select State</em>
                      </MenuItem>
                      {states.map((state, index) => (
                        <MenuItem key={index} value={state}>{state}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="contactDetails"
                    label="Contact Details"
                    name="contactDetails"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Items you can sell
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={canSellStamps} onChange={(e) => setCanSellStamps(e.target.checked)} name="canSellStamps" />}
                      label="Stamps"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={canSellCoins} onChange={(e) => setCanSellCoins(e.target.checked)} name="canSellCoins" />}
                      label="Coins"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={canSellNotes} onChange={(e) => setCanSellNotes(e.target.checked)} name="canSellNotes" />}
                      label="Notes"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </StyledButton>
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}

export default FormFill;