// src/component/Theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4FC4CA',
    },
    secondary: {
      main: '#6862A0',
    },
  },
  typography: {
    fontFamily: 'Cairo, sans-serif',
  },
});

export default theme; // ✅ مهم جداً
