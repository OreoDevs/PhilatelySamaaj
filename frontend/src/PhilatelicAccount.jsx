import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  Button, TextField, Card, CardContent, CardActions, 
  Typography, List, ListItem, ListItemText, Alert
} from '@mui/material';



const db = getFirestore(app);
const auth = getAuth(app);

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
    // This is a placeholder for USPS API integration
    alert(`Requesting USPS service: ${service}`);
  };

  if (!user) {
    return (
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
    );
  }

  return (
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
  );
};

export default PhilatelicAccount;