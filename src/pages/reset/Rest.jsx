
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Reset() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('https://mytshop.runasp.net/api/Account/ForgotPassword', {
        email: data.email,
      });
      alert('Reset code sent to your email.');
      navigate('/verify-code', { state: { email: data.email } });
    } catch (error) {
      console.error('Error sending reset code:', error);
      alert('Failed to send reset code. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
        Reset Password
      </Typography>

      <TextField
        {...register('email', { required: true })}
        label="Email"
        type="email"
        fullWidth
        variant="filled"
        required
      />

      <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
        Send Code
      </Button>
    </Box>
  );
}
