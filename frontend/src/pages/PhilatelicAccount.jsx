import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Button, TextField, Card, CardContent, CardActions, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Initialize Firebase
const db = getFirestore();
const auth = getAuth();

// Define Material-UI theme
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
      fontSize: '1rem',
    },
  },
});

const PhilatelicAccount = () => {
  const [user, setUser] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [newPurchase, setNewPurchase] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAccountData(user.uid);
      } else {
        setUser(null);
        setAccountBalance(0);
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAccountData = async (userId) => {
    try {
      const accountSnapshot = await getDocs(collection(db, 'accounts'));
      const accountDoc = accountSnapshot.docs.find(doc => doc.id === userId);
      if (accountDoc) {
        const accountData = accountDoc.data();
        setAccountBalance(accountData.balance);
        setTransactions(accountData.transactions || []);
      }
    } catch (error) {
      setError('Error fetching account data');
    }
  };

  const handlePurchase = async () => {
    if (!newPurchase || isNaN(newPurchase)) {
      setError('Please enter a valid purchase amount');
      return;
    }

    const amount = parseFloat(newPurchase);
    if (amount > accountBalance) {
      setError('Insufficient funds');
      return;
    }

    try {
      const newBalance = accountBalance - amount;
      const newTransaction = {
        type: 'purchase',
        amount: amount,
        date: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'accounts', user.uid), {
        balance: newBalance,
        transactions: [...transactions, newTransaction],
      });

      setAccountBalance(newBalance);
      setTransactions([...transactions, newTransaction]);
      setNewPurchase('');
    } catch (error) {
      setError('Purchase failed. Please try again.');
    }
  };

  const requestUSPSService = async (service) => {
    alert(`Requesting USPS service: ${service}`);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Logout failed. Please try again.');
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const pay = async () => {
    const amount = 100; // Example amount
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_fREyKXWxjeLkPv",
      amount: amount * 100,
      currency: "INR",
      name: "Philatelic Account",
      description: "Deposit Transaction",
      handler: function (response) {
        // Handle success response
        orderPlace();
      },
      prefill: {
        name: user?.displayName || "User",
        email: user?.email || "",
        contact: "8779471231",
      },
      notes: {
        address: "India",
      },
      theme: {
        color: "#158993",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const orderPlace = () => {
    console.log("Order placed successfully");
  };

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Card>
          <CardContent>
            <Typography variant="h5">Philatelic Account Login</Typography>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardContent>
          <Typography variant="h5">Philatelic Deposit Account</Typography>
          <Typography variant="body1">Welcome, {user.email}</Typography>
          <Typography variant="h6">Account Balance: ${accountBalance.toFixed(2)}</Typography>

          <Typography variant="h6">Recent Transactions</Typography>
          <List>
            {transactions.map((transaction, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`${transaction.type}: $${transaction.amount.toFixed(2)}`}
                  secondary={new Date(transaction.date).toLocaleDateString()}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6">Make a Purchase</Typography>
          <TextField
            type="number"
            value={newPurchase}
            onChange={(e) => setNewPurchase(e.target.value)}
            label="Enter amount"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handlePurchase}>
            Purchase
          </Button>

          <Typography variant="h6">USPS Services</Typography>
          <Button variant="outlined" onClick={() => requestUSPSService('Check stamp availability')}>
            Check Stamp Availability
          </Button>
          <Button variant="outlined" onClick={() => requestUSPSService('Order custom stamps')}>
            Order Custom Stamps
          </Button>
          <Button variant="outlined" onClick={() => requestUSPSService('Schedule pickup')}>
            Schedule Pickup
          </Button>

          <Typography variant="h6">Make a Payment</Typography>
          <Button variant="contained" color="secondary" onClick={pay}>
            Pay with Razorpay
          </Button>
        </CardContent>

        <CardActions>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </CardActions>

        {error && (
          <Alert severity="error">{error}</Alert>
        )}
      </Card>
    </ThemeProvider>
  );
};

export default PhilatelicAccount;
