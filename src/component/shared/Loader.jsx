import React from 'react';
import { LoadingButton } from '@mui/lab'; // ✅ استيراد الزر الخاص بالتحميل
import { Box } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <LoadingButton loading variant="outlined">
        Loading...
      </LoadingButton>
    </Box>
  );
}
