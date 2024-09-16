import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { Search, FilterList, LocalOffer, Book, Cancel, PostAdd } from '@mui/icons-material';

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

const PhilatelicItemCatalog = () => {
  const [postalCircle, setPostalCircle] = useState('');
  const [yearRange, setYearRange] = useState([1950, 2024]);
  const [itemTypes, setItemTypes] = useState({
    stamps: true,
    firstDayCovers: false,
    postcards: false,
  });
  const [rarity, setRarity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [catalogItems, setCatalogItems] = useState([]);
  const [ancillaries, setAncillaries] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Mock data - replace with actual API calls in a real application
  useEffect(() => {
    setCatalogItems([
      { id: 1, name: "Mahatma Gandhi Centenary", year: 1969, type: "stamps", rarity: "common", postalCircle: "Delhi", image: "/api/placeholder/150/200" },
      { id: 2, name: "Indian National Flag", year: 1947, type: "firstDayCovers", rarity: "rare", postalCircle: "Mumbai", image: "/api/placeholder/150/200" },
      { id: 3, name: "Taj Mahal", year: 1995, type: "postcards", rarity: "uncommon", postalCircle: "Agra", image: "/api/placeholder/150/200" },
      // Add more items as needed
    ]);

    setAncillaries([
      { id: 1, name: "Deluxe Stamp Album", type: "album", image: "/api/placeholder/100/100" },
      { id: 2, name: "First Day Cover Collection Box", type: "storage", image: "/api/placeholder/100/100" },
      { id: 3, name: "Commemorative Cancellation Stamp Set", type: "tools", image: "/api/placeholder/100/100" },
    ]);

    setRecommendations([
      { id: 1, name: "Rare Butterfly Series", year: 2005, type: "stamps", image: "/api/placeholder/100/100" },
      { id: 2, name: "Vintage Postcard Collection", year: 1980, type: "postcards", image: "/api/placeholder/100/100" },
    ]);
  }, []);

  const handlePostalCircleChange = (event) => {
    setPostalCircle(event.target.value);
  };

  const handleYearRangeChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleItemTypeChange = (event) => {
    setItemTypes({ ...itemTypes, [event.target.name]: event.target.checked });
  };

  const handleRarityChange = (event) => {
    setRarity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterItems = () => {
    return catalogItems.filter(item => 
      (postalCircle === '' || item.postalCircle === postalCircle) &&
      (item.year >= yearRange[0] && item.year <= yearRange[1]) &&
      (itemTypes[item.type]) &&
      (rarity === '' || item.rarity === rarity) &&
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', p: 4 }}>
        <Typography variant="h2" color="primary" align="center" gutterBottom>
          Philatelic Item Catalog
        </Typography>

        <Grid container spacing={4}>
          {/* Filters */}
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: 'background.paper', mb: 2 }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  <FilterList /> Filters
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Postal Circle</InputLabel>
                  <Select value={postalCircle} onChange={handlePostalCircleChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                    <MenuItem value="Kolkata">Kolkata</MenuItem>
                    <MenuItem value="Chennai">Chennai</MenuItem>
                    <MenuItem value="Agra">Agra</MenuItem>
                  </Select>
                </FormControl>
                <Typography gutterBottom>Year Range</Typography>
                <Slider
                  value={yearRange}
                  onChange={handleYearRangeChange}
                  valueLabelDisplay="auto"
                  min={1900}
                  max={2024}
                />
                <Typography gutterBottom>Item Types</Typography>
                <FormControlLabel
                  control={<Checkbox checked={itemTypes.stamps} onChange={handleItemTypeChange} name="stamps" />}
                  label="Stamps"
                />
                <FormControlLabel
                  control={<Checkbox checked={itemTypes.firstDayCovers} onChange={handleItemTypeChange} name="firstDayCovers" />}
                  label="First Day Covers"
                />
                <FormControlLabel
                  control={<Checkbox checked={itemTypes.postcards} onChange={handleItemTypeChange} name="postcards" />}
                  label="Postcards"
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Rarity</InputLabel>
                  <Select value={rarity} onChange={handleRarityChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="common">Common</MenuItem>
                    <MenuItem value="uncommon">Uncommon</MenuItem>
                    <MenuItem value="rare">Rare</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Main content */}
          <Grid item xs={12} md={9}>
            {/* Search bar */}
            <Box sx={{ mb: 2, display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <Search />,
                }}
              />
            </Box>

            {/* Catalog items */}
            <Grid container spacing={2}>
              {filterItems().map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card sx={{ backgroundColor: 'background.paper' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Year: {item.year}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {item.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rarity: {item.rarity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Ancillaries Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                <LocalOffer /> Ancillaries
              </Typography>
              <Grid container spacing={2}>
                {ancillaries.map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={{ backgroundColor: 'background.paper' }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={item.image}
                        alt={item.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {item.type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Recommendations Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                <Book /> Recommended for You
              </Typography>
              <List>
                {recommendations.map(item => (
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar src={item.image} alt={item.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.year} - ${item.type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default PhilatelicItemCatalog;