import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  CssBaseline,
  Link,
  Paper,
  Avatar,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LockOutlined, Google } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Create a custom theme
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  boxShadow: '0 8px 32px 0 rgba(139, 69, 19, 0.37)',
  borderRadius: '15px',
  border: '1px solid rgba(218, 165, 32, 0.18)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}33`,
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'white',
  color: theme.palette.text.primary,
  borderRadius: 3,
  border: `1px solid ${theme.palette.grey[300]}`,
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: theme.palette.grey[100],
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData) {
        const { accountType } = userData;
        navigate(`/dashboard-${accountType.toLowerCase()}`);
      } else {
        alert('User data not found!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in failed:', error);
      alert(`Google sign in failed: ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{marginBottom:'30px'}}>
        <CssBaseline />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={6}>
            <StyledAvatar>
              <LockOutlined />
            </StyledAvatar>
            <Typography component="h1" variant="h5" sx={{ fontFamily: '"Playfair Display", serif' }}>
              Sign in to Farmissan
            </Typography>
            <Form onSubmit={handleLogin}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign In
              </SubmitButton>
              <GoogleButton
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </GoogleButton>
              <Box mt={2}>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>
            </Form>
          </StyledPaper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default Login;