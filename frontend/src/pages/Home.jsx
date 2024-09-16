import React from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Search, Notifications, AccountCircle } from '@mui/icons-material';
import Footer from '../components/Footer';

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
    fontSize: 16, // Increased base font size
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3.5rem', // Increased from default
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '3rem', // Increased from default
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem', // Increased from default
    },
    h5: {
      fontSize: '1.5rem', // Increased from default
    },
    body1: {
      fontSize: '1.1rem', // Increased from default
    },
    body2: {
      fontSize: '1rem', // Increased from default
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const StampCard = ({ title, description, imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3,minHeight:'100%' }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        sx={{ objectFit: 'contain',maxHeight:'300px',objectPosition:'center' }}
      />
      <CardContent sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
        <Typography gutterBottom variant="h5" component="div" color="primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const FeatureCard = ({ title, description, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Paper elevation={3} sx={{ p: 3, height: '100%', bgcolor: 'background.paper',minHeight:'250px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
        <Typography variant="h5" component="div" color="primary">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  </motion.div>
);



const BodyContent = () => (
  <>
    {/* Hero Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
          textAlign: 'center',
          borderBottom: '2px dashed',
          borderColor: 'primary.main',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Welcome to the National Philately Community
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Discover, Connect, and Collect Across India's Rich Postal Heritage
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Join Our Community
          </Button>
        </Container>
      </Box>
    </motion.div>

    {/* Featured Stamps */}
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography
        component="h2"
        variant="h3"
        color="primary"
        align="center"
        gutterBottom
        sx={{ mb: 6, fontWeight: 'bold' }}
      >
        Featured Stamps
      </Typography>
      <Grid container spacing={4}>
        {[
          {
            title: 'Taj Mahal Centenary',
            description: 'Commemorating 100 years of the iconic Taj Mahal stamp.',
            imageUrl: '/api/placeholder/400/300?text=Taj+Mahal+Centenary',
          },
          {
            title: 'Flora of India',
            description: 'A vibrant collection showcasing India\'s diverse plant life.',
            imageUrl: '/Stamp1.png',
          },
          {
            title: 'Freedom Fighters Series',
            description: 'Honoring the heroes of India\'s independence movement.',
            imageUrl: 'https://imgk.timesnownews.com/story/first_postage_stamp.png',
          },
        ].map((stamp, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <StampCard {...stamp} />
          </Grid>
        ))}
      </Grid>
    </Container>

    {/* Features Section */}
    <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          color="primary"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Explore Our Features
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: 'National Philately Deposit Account',
              description: 'Access philatelic material from all postal circles across India with ease.',
              icon: AccountCircle,
            },
            {
              title: 'Virtual Exhibitions',
              description: 'Showcase your collection and explore rare stamps from other enthusiasts.',
              icon: Search,
            },
            {
              title: 'Community Forums',
              description: 'Engage in lively discussions with fellow philatelists from across the country.',
              icon: Notifications,
            },
          ].map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

    {/* CTA Section */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: 8,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h2"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Ready to Start Your Philatelic Journey?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 4, px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>
    </motion.div>
  </>
);

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <BodyContent />
      </Box>
    </ThemeProvider>
  );
};

export default Home;