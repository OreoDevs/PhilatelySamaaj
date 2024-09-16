import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Search, Notifications, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the theme
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
  shape: {
    borderRadius: 8,
  },
});

const Header = () => {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [y, setY] = useState(window.scrollY);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setAccountType(userDoc.data().accountType);
        }
      } else {
        setUser(null);
        setAccountType('');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/trans' },
    { name: 'Loans', path: '/loans' }
  ];

  const MenuLink = ({ to, children }) => (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        cursor: 'pointer',
        color: 'text.primary',
        position: 'relative',
        textDecoration: 'none',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '0',
          height: '2px',
          bottom: '-4px',
          left: '50%',
          backgroundColor: theme.palette.primary.main,
          transition: 'all 0.3s ease-in-out',
        },
        '&:hover::after': {
          width: '100%',
          left: '0',
        },
      }}
    >
      {children}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AppBar
          position="static"
          color="primary"
          elevation={0}
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
            boxShadow: 0,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              National Philately Community
            </Typography>

            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                  sx={{ ml: 'auto' }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {menuItems.map((item) => (
                    <MenuItem key={item.name} onClick={handleClose}>
                      <MenuLink to={item.path}>
                        {item.name}
                      </MenuLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleClose}>
                    <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Log in
                    </RouterLink>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box className="ml-auto flex items-center space-x-6">
                {menuItems.map((item) => (
                  <MenuLink key={item.name} to={item.path}>
                    {item.name}
                  </MenuLink>
                ))}
                <Box
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '0',
                      height: '2px',
                      bottom: '-4px',
                      left: '50%',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'all 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      width: '100%',
                      left: '0',
                    },
                  }}
                >
                  Log in
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}

            {user && (
              <div className="flex items-center ml-4">
                <img
                  src={user.photoURL || 'https://example.com/default-profile-pic.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="mr-4">
                  <span className="block font-bold">{user.displayName || 'User'}</span>
                  <span className="text-sm">{accountType}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark,
                    },
                  }}
                >
                  Logout
                </Button>
              </div>
            )}

            <IconButton color="inherit" component={RouterLink} to="/cart" sx={{ ml: 2 }}>
              <ShoppingCartIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </motion.div>
    </ThemeProvider>
  );
};

export default Header;
