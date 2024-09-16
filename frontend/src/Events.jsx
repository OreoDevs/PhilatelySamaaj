import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Modal,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';

// Ensure Leaflet's default icon path is set
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const PhilatelicEventsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const events = [
    { id: 1, name: "Delhi Stamp Exhibition", lat: 28.6139, lng: 77.2090, description: "Annual exhibition featuring rare Indian stamps", organizer: "Philatelic Society of India", date: "2024-10-15", website: "www.delhistampexhibition.com", price: 500 },
    { id: 2, name: "Mumbai Collectors' Fair", lat: 19.0760, lng: 72.8777, description: "Largest stamp and coin collection event in Western India", organizer: "Mumbai Philatelists Association", date: "2024-11-05", website: "www.mumbaicollectorsfair.org", price: 600 },
    { id: 3, name: "Kolkata Philatelic Symposium", lat: 22.5726, lng: 88.3639, description: "Academic conference on Indian postal history", organizer: "Bengal Philatelic Society", date: "2024-09-20", website: "www.kolkataphilately.com", price: 300 },
    { id: 4, name: "Bangalore Stamp Workshop", lat: 12.9716, lng: 77.5946, description: "Hands-on workshop for beginners in stamp collecting", organizer: "Karnataka Philatelic Society", date: "2024-08-10", website: "www.bangalorestamps.org", price: 200 },
    { id: 5, name: "Chennai Rare Stamps Auction", lat: 13.0827, lng: 80.2707, description: "Auction of valuable and rare Indian stamps", organizer: "South India Philatelists' Association", date: "2024-12-03", website: "www.chennaistampauction.com", price: 1000 },
  ];

  const customIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Unable to get your location. Please try again.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const RoutingMachine = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !start || !end) return;

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng),
          L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        toast.info(`Route found! Distance: ${(summary.totalDistance / 1000).toFixed(2)} km, Estimated time: ${Math.round(summary.totalTime / 60)} minutes`);
      });

      return () => map.removeControl(routingControl);
    }, [map, start, end]);

    return null;
  };

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
      <Box className="min-h-screen p-4" sx={{ backgroundColor: 'background.default' }}>
        <ToastContainer position="top-right" autoClose={5000} />
        <Typography variant="h1" className="mb-6 text-center" color="primary">
          Philatelic Events in India
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {userLocation ? (
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '70vh', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {events.map((event) => (
                  <Marker
                    key={event.id}
                    position={[event.lat, event.lng]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedEvent(event);
                        setShowDetails(true);
                        toast.success(`Selected event: ${event.name}`);
                      },
                    }}
                  >
                    <Popup>
                      <Typography variant="h6">{event.name}</Typography>
                      <Typography variant="body2">{event.description}</Typography>
                      <Typography variant="body2">
                        Distance: {calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng).toFixed(2)} km
                      </Typography>
                      <Button
                        onClick={() => openBookingModal(event)}
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Book Tickets
                      </Button>
                    </Popup>
                  </Marker>
                ))}
                {selectedEvent && (
                  <RoutingMachine start={userLocation} end={{ lat: selectedEvent.lat, lng: selectedEvent.lng }} />
                )}
              </MapContainer>
            ) : (
              <Typography>Loading map...</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  Upcoming Events
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
                        primary={event.name}
                        secondary={`${event.description} - ${format(parseISO(event.date), 'MMMM d, yyyy')}`}
                      />
                    </ListItem>
                  ))}
                </List>
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
            <Typography><strong>Date:</strong> {selectedEvent && format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}</Typography>
            <Typography><strong>Price:</strong> ₹{selectedEvent?.price}</Typography>
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

export default PhilatelicEventsPage;