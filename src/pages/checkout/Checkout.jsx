import { Box, FormControl, Radio, RadioGroup, Typography, FormControlLabel, Card, Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
    const navigate   = useNavigate();
  
    const [paymentMethod,setPaymentMethod] = useState ('visa');
    const handelPaymentMethod = (event)=>{
        setPaymentMethod(event.target.value);
    }
    const handelPay = async ()=>{
        const token = localStorage.getItem("userToken");
        const response  = await  axios.post (`https://mytshop.runasp.net/api/CheckOuts/Pay`,{
            PaymentMethod:paymentMethod,

        },{
            headers :{
                Authorization:`Bearer ${token}`
            }
        }
    );
    if(paymentMethod=='Visa'){
      location.href=response.data.url
    }else{
      navigate('/profile/order')
      
    }
    console.log(response);
    }  

    
  return (
    <Box>
      <Card sx={{ p: 4 }}>
        <Typography variant="h2" gutterBottom>
          Checkout
        </Typography>

        <FormControl>
            <Typography variant="h3">
                Select payment Method
            </Typography>
          <RadioGroup value={paymentMethod} onChange={handelPaymentMethod}>
            <FormControlLabel value="Visa" control={<Radio />} label="Visa" />
            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
          </RadioGroup>
        </FormControl>

        <Button onClick={handelPay}
         fullWidth
          variant='contained'
        >confirm payment</Button>
      </Card>
    </Box>
  );
}
