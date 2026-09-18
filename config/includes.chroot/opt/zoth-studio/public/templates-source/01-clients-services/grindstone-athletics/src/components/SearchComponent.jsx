import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Paper, Link } from '@mui/material';

const SearchComponent = ({ data, searchFields, placeholder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredData(
      data.filter(item =>
        searchFields.some(field => item[field]?.toLowerCase().includes(query))
      )
    );
  }, [searchQuery, data, searchFields]);

  return (
    <Box className="search-component">
      <TextField
        label={placeholder || "Search"}
        fullWidth
        margin="normal"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <Box mt={2} className="search-results">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body1" color="textSecondary">{item.content}</Typography>
              <Link href={item.link} variant="body2" color="primary">Go to {item.page}</Link>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No results found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchComponent;
