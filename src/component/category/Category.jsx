import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import styles from "../category/category.module.css";

export default function Category() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get('https://mytshop.runasp.net/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Grid container spacing={2} className={styles.section}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={category.id}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title={category.name} />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {category.description || 'No description available'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Details</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
