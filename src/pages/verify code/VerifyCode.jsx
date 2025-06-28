import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';

export default function VerifyCode() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/reset');
    }
  }, [email, navigate]);

  if (!email) return null;

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await axios.patch('https://mytshop.runasp.net/api/Account/SendCode', {
        email,
        code: data.code,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      alert('Code verified successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Invalid or expired code. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h5" align="center" fontWeight="bold">
        Verify Reset Code & Change Password
      </Typography>

      <TextField
        {...register('email')}
        label="Email"
        variant="filled"
        disabled
        defaultValue={email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AlternateEmailIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      <TextField
        {...register('code', { required: 'Reset code is required' })}
        label="Reset Code"
        variant="filled"
        error={!!errors.code}
        helperText={errors.code?.message}
        fullWidth
      />

      <TextField
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
        })}
        label="New Password"
        type="password"
        variant="filled"
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      <TextField
        {...register('confirmPassword', {
          required: 'Confirm your password',
        })}
        label="Confirm Password"
        type="password"
        variant="filled"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PasswordIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
      />

      <Button type="submit" variant="contained" size="large" fullWidth>
        Verify & Change Password
      </Button>
    </Box>
  );
}
