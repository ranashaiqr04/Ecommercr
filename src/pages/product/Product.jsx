import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
    Button

} from '@mui/material';
import Loader from '../../component/shared/Loader';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getProduct = async () => {
    try {
      const response = await axios.get(`https://mytshop.runasp.net/api/products/${id}`);
      setProduct(response.data);
      setLoading(false); // ✅ توقف التحميل بعد نجاح الطلب
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product.');
      setLoading(false); // ✅ حتى في حالة الخطأ أوقف التحميل
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (isLoading) {return <Loader/> }
  if (error) return <div>{error}</div>;

 const addToCart = async (id)=>{
  alert(id);
  const userToken =localStorage .getItem ("userToken");
  // The token maybe we can say like card, help me to know ho the user 

  const respons = await axios.post (`https://mytshop.runasp.net/api/Carts/${id}`,{},
    {
         headers: {
         Authorization: `Bearer ${userToken}` //Bearer : From Backend
         //to know the user
          }

    }

  );//رح اارسل داتا باشي اسمه الهيدر, الهيدر اشي بكون مخفي بس المشكلة البوست لازم بالبرامتير التاني ابعت داتا فشي داتا بخلي فاضي
  console.log(respons);
 }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>
           <CardMedia 
           component={'img'}
           image={product.mainImg}
           />
          <Typography variant="body1" color="text.secondary">
            {product.description || 'No description available'}
          </Typography>
          <Button onClick={()=>addToCart(product.id)} >Add  To Cart</Button> {/*عشان يعرف عندي مين المنتج يلي بده يضيفه لازم ابعت id */}
        </CardContent>
      </Card>
    </Box>

    //post,put,patch
    // at laest should be take two parmeter 
    // 1-url
    // 2-data
    // 
    //  */
  );
}
