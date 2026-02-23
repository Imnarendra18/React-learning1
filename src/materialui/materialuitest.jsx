import React from 'react';
import { Button, Typography, Box } from '@mui/material';

function MaterialUITest() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Material-UI Test
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </Box>
  );
}

export default MaterialUITest;