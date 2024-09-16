import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Button,
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import { CalendarMonth, EventNote, Payment } from '@mui/icons-material';

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

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const events = [
    { 
      id: 1, 
      name: "Delhi Stamp Exhibition", 
      date: "2024-10-15", 
      description: "Annual exhibition featuring rare Indian stamps",
      price: 500,
      location: "Pragati Maidan, New Delhi"
    },
    { 
      id: 2, 
      name: "Mumbai Collectors' Fair", 
      date: "2024-11-05", 
      description: "Largest stamp and coin collection event in Western India",
      price: 600,
      location: "Bandra Kurla Complex, Mumbai"
    },
    { 
      id: 3,  
      name: "Kolkata Philatelic Symposium",  
      date: "2024-09-20",  
      description: "Academic conference on Indian postal history", 
      price: 300,
      location: "Science City, Kolkata"
    }, 
    {  
      id: 4,  
      name: "Bangalore Stamp Workshop",  
      date: "2024-08-10",  
      description: "Hands-on workshop for beginners in stamp collecting", 
      price: 200,
      location: "Bengaluru Palace Grounds"
    }, 
    {  
      id: 5,  
      name: "Chennai Rare Stamps Auction",  
      date: "2024-12-03",  
      description: "Auction of valuable and rare Indian stamps", 
      price: 1000,
      location: "Chennai Trade Centre"
    }, 
  ];

  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const openPaymentModal = () => {
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(true);
  };

  const closeSnackbar = () => {
    setPaymentSuccess(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', p: 4 }}>
        <Typography variant="h1" color="primary" align="center" gutterBottom>
          Philatelic Events Calendar
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Upcoming Philatelic Events
              </Typography>
              <List>
                {events.map((event) => (
                  <ListItem
                    key={event.id}
                    button
                    onClick={() => openBookingModal(event)}
                    sx={{
                      mb: 2,
                      backgroundColor: 'background.default',
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6">
                          {event.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            <CalendarMonth fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {format(parseISO(event.date), 'MMMM d, yyyy')}
                          </Typography>
                          <Typography variant="body2">
                            <EventNote fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            {event.description}
                          </Typography>
                          <Typography variant="body2">
                            <Payment fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Price: ₹{event.price}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Event Highlights
                </Typography>
                <Typography variant="body1" paragraph>
                  Don't miss out on these exciting philatelic events across India! From exhibitions to auctions, there's something for every stamp enthusiast.
                </Typography>
                <Typography variant="body1" paragraph>
                  Click on an event to book your tickets and be part of these unforgettable experiences in the world of philately.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Booking Modal */}
        <Modal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          aria-labelledby="event-booking-title"
          aria-describedby="event-booking-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography id="event-booking-title" variant="h5" color="primary" gutterBottom>
              Book Tickets: {selectedEvent?.name}
            </Typography>
            <Typography id="event-booking-description" gutterBottom>
              {selectedEvent?.description}
            </Typography>
            <Typography gutterBottom>
              <strong>Date:</strong> {selectedEvent && format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}
            </Typography>
            <Typography gutterBottom>
              <strong>Location:</strong> {selectedEvent?.location}
            </Typography>
            <Typography gutterBottom>
              <strong>Price:</strong> ₹{selectedEvent?.price}
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={openPaymentModal}
                sx={{ mr: 2 }}
              >
                Proceed to Pay
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowBookingModal(false)}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Payment Modal */}
        <Modal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          aria-labelledby="payment-modal-title"
          aria-describedby="payment-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography id="payment-modal-title" variant="h5" color="primary" gutterBottom>
              Payment for {selectedEvent?.name}
            </Typography>
            <Typography id="payment-modal-description" gutterBottom>
              You are about to pay ₹{selectedEvent?.price} for the event.
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                sx={{ mr: 2 }}
              >
                Pay Now
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Snackbar for payment success */}
        <Snackbar open={paymentSuccess} autoHideDuration={6000} onClose={closeSnackbar}>
          <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
            Payment successful! Your ticket has been booked.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default EventCalendar;