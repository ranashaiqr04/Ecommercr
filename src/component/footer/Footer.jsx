// src/components/layout/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  YouTube,
  Twitter,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

export default function Footer({ brand = "NorthStar" }) {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",          // <-- same color family as Navbar (AppBar default)
        color: "primary.contrastText",
        mt: 8,
      }}
    >
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={700}>
              {brand}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              A one‑stop shop for fashion and lifestyle. Free shipping over $100,
              24/7 support, and 30‑day returns.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" href="#" sx={{ color: "inherit" }}>
                <Facebook />
              </IconButton>
              <IconButton aria-label="Instagram" href="#" sx={{ color: "inherit" }}>
                <Instagram />
              </IconButton>
              <IconButton aria-label="Twitter" href="#" sx={{ color: "inherit" }}>
                <Twitter />
              </IconButton>
              <IconButton aria-label="YouTube" href="#" sx={{ color: "inherit" }}>
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" underline="hover" color="inherit">
                Home
              </Link>
              <Link href="/shop" underline="hover" color="inherit">
                Shop
              </Link>
              <Link href="/about" underline="hover" color="inherit">
                About Us
              </Link>
              <Link href="/contact" underline="hover" color="inherit">
                Contact
              </Link>
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              <Link href="/shipping" underline="hover" color="inherit">
                Shipping
              </Link>
              <Link href="/returns" underline="hover" color="inherit">
                Returns
              </Link>
              <Link href="/faq" underline="hover" color="inherit">
                FAQ
              </Link>
              <Link href="/track-order" underline="hover" color="inherit">
                Track Order
              </Link>
            </Stack>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <Stack spacing={1.2}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <LocationOn fontSize="small" />
                <Typography variant="body2">Ramallah, Palestine</Typography>
              </Stack>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Phone fontSize="small" />
                <Typography variant="body2">+970 59 000 0000</Typography>
              </Stack>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Email fontSize="small" />
                <Typography variant="body2">support@northstar.com</Typography>
              </Stack>
            </Stack>

            <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
              Newsletter
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Your email address"
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "inherit",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  },
                }}
                inputProps={{ "aria-label": "email address" }}
              />
              <Button variant="contained" color="secondary">
                Subscribe
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.15)" }} />

        {/* Bottom bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            © {year} {brand}. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Link href="/privacy" underline="hover" color="inherit">
              Privacy Policy
            </Link>
            <Link href="/terms" underline="hover" color="inherit">
              Terms of Service
            </Link>
            <Link href="/cookies" underline="hover" color="inherit">
              Cookie Policy
            </Link>
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Payments: Visa • MasterCard • PayPal • Cash on Delivery
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
