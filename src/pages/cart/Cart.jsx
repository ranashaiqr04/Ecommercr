import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import Loader from "../../component/shared/Loader";
import { Link } from 'react-router-dom';

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [totalItems,setTotalItems]=useState (0);
  let test = 0 ;


const getProductFromCart = async () => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await axios.get("https://mytshop.runasp.net/api/Carts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cartData = response.data.cartResponse || [];
    setProducts(cartData);
    setTotalPrice(response.data.totalPrice);

    let items = 0;
    cartData.forEach((product) => {
      test = totalItems + product.count ; 

    });
    setTotalItems(test);
  } catch (error) {
    console.error("Error fetching cart:", error);
  } finally {
    setLoading(false);
  }
};


  const increaseQty = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `https://mytshop.runasp.net/api/Carts/increaseCount/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, count: product.count + 1 } : product
      );
      setProducts(updatedProducts);
      await getProductFromCart();
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const deCreaseQty = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const targetProduct = products.find((p) => p.id === id);

      if (targetProduct.count === 1) {
        await axios.delete(`https://mytshop.runasp.net/api/Carts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
      } else {
        await axios.patch(
          `https://mytshop.runasp.net/api/Carts/decreaseCount/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedProducts = products.map((product) =>
          product.id === id ? { ...product, count: product.count - 1 } : product
        );
        setProducts(updatedProducts);
      }

      await getProductFromCart();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`https://mytshop.runasp.net/api/Carts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      await getProductFromCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearItem = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete("https://mytshop.runasp.net/api/Carts/clearCart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    getProductFromCart();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Box>
      <Typography variant="h2" gutterBottom>
        Shopping Cart
      </Typography>

      <Button onClick={clearItem} color="error" variant="outlined" sx={{ mb: 2 }}>
        Clear Cart
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {products.length === 0 ? (
            <Typography variant="h5">Your cart is empty.</Typography>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={product.imageUrl || "https://placehold.co/100"}
                  sx={{ borderRadius: 2, width: 100 }}
                />

                <CardMedia
          component="img"
          image={`https://mytshop.runasp.net/Images/${product.image}` || 'https://placehold.co/100'}
          sx={{ width: 100, height: 100, borderRadius: 2 }}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="subtitle1" color="primary">
            {product.price || '4$'}
          </Typography>
        </CardContent>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <IconButton onClick={() => deCreaseQty(product.id)}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{product.count || 1}</Typography>
                  <IconButton onClick={() => increaseQty(product.id)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => removeItem(product.id)}>
                    <Delete color="error" />
                  </IconButton>
                </Box>
              </Card>
            ))
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Order Summary
          </Typography>

          <Typography variant="h6" mt={2}>
            Total Price: {totalPrice}$
          </Typography>

            <Typography variant="h6" mt={2}>
            Total Items: {totalItems}
          </Typography>

          <Button variant="contained" color="primary" component={Link} to='/checkout' sx={{ mt: 2 }}>
            Checkout
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
