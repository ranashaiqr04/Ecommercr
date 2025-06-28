import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia, // ✅ أضف هذا السطر
  Button,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { Link } from 'react-router';

export default function Products() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get('https://mytshop.runasp.net/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
<Box sx={{ p: 2 }}>
  <Grid container spacing={2}>
    {products.map((product) => (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={product.id}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* صورة المنتج */}
          <CardMedia
          component={'img'} image={product.mainImg}
          alt={product.description}

          />

          {/* عنوان المنتج */}
          <CardHeader title={product.name} />

          {/* وصف المنتج */}
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {product.description || 'No description available'}
            </Typography>
          </CardContent>

          {/* زر التفاصيل */}
          <CardActions sx={{ mt: 'auto' }}>
            <Button size="small" component={Link} to={`/product/${product.id}`}  >Details</Button>
          </CardActions>

        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

  );
}
