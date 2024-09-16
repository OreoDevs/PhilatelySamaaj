import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Button,
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';

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
      price: 500
    },
    { 
      id: 2, 
      name: "Mumbai Collectors' Fair", 
      date: "2024-11-05", 
      description: "Largest stamp and coin collection event in Western India",
      price: 600
    },
    { 
      id: 3,  
      name: "Kolkata Philatelic Symposium",  
      date: "2024-09-20",  
      description: "Academic conference on Indian postal history", 
      price: 300 
    }, 
    {  
      id: 4,  
      name: "Bangalore Stamp Workshop",  
      date: "2024-08-10",  
      description: "Hands-on workshop for beginners in stamp collecting", 
      price: 200 
    }, 
    {  
      id: 5,  
      name: "Chennai Rare Stamps Auction",  
      date: "2024-12-03",  
      description: "Auction of valuable and rare Indian stamps", 
      price: 1000 
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
    <Box className="bg-[#f2ce8b] p-4 min-h-screen"> 
      <Typography variant="h4" className="text-[#8B4513] font-bold mb-6"> 
        Upcoming Philatelic Events 
      </Typography> 
      <List> 
        {events.map((event) => ( 
          <ListItem button key={event.id} onClick={() => openBookingModal(event)} className="bg-[#FAEBD7] p-4 my-2 rounded-md shadow hover:bg-[#DAA520] hover:text-white transition-all">
            <ListItemText 
              primary={event.name} 
              secondary={`${event.description} - ${format(parseISO(event.date), 'MMMM d, yyyy')}`} 
            /> 
          </ListItem> 
        ))} 
      </List> 
 
      {/* Booking Modal */} 
      {selectedEvent && ( 
        <Modal 
          open={showBookingModal} 
          onClose={() => setShowBookingModal(false)} 
          aria-labelledby="event-booking-title" 
          aria-describedby="event-booking-description" 
        > 
          <Box 
            className="bg-[#FAEBD7] p-6 rounded-lg shadow-lg" 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: 400 
            }} 
          > 
            <Typography id="event-booking-title" variant="h6" className="text-[#8B4513] font-bold mb-4"> 
              Book Tickets: {selectedEvent.name} 
            </Typography> 
            <Typography id="event-booking-description" className="mb-2"> 
              {selectedEvent.description} 
            </Typography> 
            <Typography><strong>Date:</strong> {format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}</Typography> 
            <Typography><strong>Price:</strong> ₹{selectedEvent.price}</Typography> 
            <Box mt={2}> 
              <Button 
                variant="contained" 
                className="bg-[#8B4513] hover:bg-[#A0522D] text-white" 
                onClick={openPaymentModal} 
                sx={{ mr: 2 }} 
              > 
                Proceed to Pay 
              </Button> 
              <Button 
                variant="outlined" 
                className="border-[#8B4513] text-[#8B4513]" 
                onClick={() => setShowBookingModal(false)} 
              > 
                Close 
              </Button> 
            </Box> 
          </Box> 
        </Modal> 
      )} 
 
      {/* Payment Modal */} 
      <Modal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        aria-labelledby="payment-modal-title" 
        aria-describedby="payment-modal-description" 
      > 
        <Box 
          className="bg-[#FAEBD7] p-6 rounded-lg shadow-lg" 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400 
          }} 
        > 
          <Typography id="payment-modal-title" variant="h6" className="text-[#8B4513] font-bold mb-4"> 
            Payment for {selectedEvent?.name} 
          </Typography> 
          <Typography id="payment-modal-description" className="mb-2"> 
            You are about to pay ₹{selectedEvent?.price} for the event. 
          </Typography> 
          <Box mt={2}> 
            <Button 
              variant="contained" 
              className="bg-[#8B4513] hover:bg-[#A0522D] text-white" 
              onClick={handlePayment} 
              sx={{ mr: 2 }} 
            > 
              Pay Now 
            </Button> 
            <Button 
              variant="outlined" 
              className="border-[#8B4513] text-[#8B4513]" 
              onClick={() => setShowPaymentModal(false)} 
            > 
              Cancel 
            </Button> 
          </Box> 
        </Box> 
      </Modal> 
 
      {/* Snackbar for payment success */} 
      <Snackbar open={paymentSuccess} autoHideDuration={6000} onClose={closeSnackbar}> 
        <Alert onClose={closeSnackbar} severity="success" className="bg-[#8B4513] text-white"> 
          Payment successful! Your ticket has been booked. 
        </Alert> 
      </Snackbar> 
    </Box> 
  ); 
}; 
 
export default EventCalendar;
