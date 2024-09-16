import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { 
  Box, 
  Typography, 
  Container, 
  CssBaseline,
  Paper,
  Grid,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { doc, getDoc } from 'firebase/firestore';

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

function MyProfile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'userDetails', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
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
            Loading profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  const { name, userType, state, experience, contactDetails, canSellStamps, canSellCoins, canSellNotes } = userData;

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <StyledPaper>
        <Typography component="h1" variant="h4" sx={{ marginBottom: 4 }}>
          Your Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Name: {name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">User Type: {userType}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">State: {state}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Experience: {experience}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Contact Details: {contactDetails}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Items you can sell:</Typography>
            <ul>
              {canSellStamps && <li>Stamps</li>}
              {canSellCoins && <li>Coins</li>}
              {canSellNotes && <li>Notes</li>}
            </ul>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate('/editProfile')}
        >
          Edit Profile
        </Button>
      </StyledPaper>
    </Container>
  );
}

export default MyProfile;
