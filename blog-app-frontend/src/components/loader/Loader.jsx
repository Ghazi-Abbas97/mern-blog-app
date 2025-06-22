import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const Loader = ({ message = "Loading..." }) => {
  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // dimmed background
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" size={50} thickness={4} />
      <Typography variant="h6" align="center">
        {message}
      </Typography>
    </Backdrop>
  );
};

export default Loader;
