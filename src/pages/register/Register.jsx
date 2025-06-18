import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import syles from '../register/register.module.css';
import LogIn from '../login/LogIn';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';


export default function Register() {
  const { register, handleSubmit } = useForm();

  const registerUser = async (values) => {
    try {
      const response = await axios.post(`https://mytshop.runasp.net/api/Account/register`, values);
    } catch (error) {
    }
  };

  return (
    <Box

      component="form"
      onSubmit={handleSubmit(registerUser)}
      sx={{
        maxWidth:1000,
        mx: 'auto',
        mt: 4,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Grid container spacing={2}   className={syles.center}  >
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
        Register
      </Typography>
          
        <Grid item xs={12} sm={6} >
          <TextField
            {...register('userName')}
            label="User Name"
          sx={{ width: '800px' }} 
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('firstName')}
            label="First Name"
             sx={{ width: '393px' }} 
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('lastName')}
            label="Last Name"
                      sx={{ width: '393px' }} 

            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
                sx={{ width: '800px' }} 

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
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            sx={{ width: '393px' }} 
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
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
             sx={{ width: '393px' }} 
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
        <Grid item xs={12}>
          <TextField
            {...register('birthOfDate')}
            label="Birth Date"
            type="date"
            sx={{ width: '800px' }} 

            variant="filled"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
              <Button type="submit"  className={syles.borderButton}   variant="contained" size="large" sx={{ mt: 2, width :800}}>
        Register
      </Button>

      <div className={syles.logPath} >
          

     <Typography variant="h6" component="h4">
    Already have an Account?
  </Typography> 
       <Typography
       >
        <Link to='/LogIn'  color='  secondary'  className={syles.underlink}>LogIN</Link>
        </Typography> 

      </div>


      </Grid>


    </Box>
  );
}
