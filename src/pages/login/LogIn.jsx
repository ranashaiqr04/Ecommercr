import React from 'react';
import styles from './login.module.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';


export default function LogIn() {
  const { register, handleSubmit } = useForm();
 const navigate = useNavigate();

 
  const onLogin = async (values) => {
    try {
      const response = await axios.post(
        `https://mytshop.runasp.net/api/Account/Login`,
        values );
      //Token
      //
      localStorage.setItem("userToken",response.data.token);
          navigate('/');
          console.log(response);
          // شغلة التوكن عشان اقدر اعرف مين اليوزر يلي بتنقل بالصفحات
          //بخزن قيمة التوكن باللوكل ستورج
     
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onLogin)}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 4,
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
        Log In
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Button type="submit"
       variant="contained"
        size="large" 
        fullWidth sx={{ mt: 2 }}>
        Log In
      </Button>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body1">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/regiter"
            color="secondary"
            underline="none"
            sx={{ fontWeight: 'bold' }}
          >
            Register
          </Link>
        </Typography>
      </Box>




      
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body1">
          Forget Password?{' '}
          <Link
            component={RouterLink}
            to="/resetPassword"
            color="secondary"
            underline="none"
            sx={{ fontWeight: 'bold' }}
          >
            Reset
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
