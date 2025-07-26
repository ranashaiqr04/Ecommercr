// src/pages/profile/Orders.jsx
import * as React from "react";
import axios from "axios";
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Alert, Button, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, Grid, TableContainer
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://mytshop.runasp.net";

export default function Orders() {
  const navigate = useNavigate();

  // Orders list state
  const [orders, setOrders] = React.useState([]);
  const [listLoading, setListLoading] = React.useState(true);
  const [listError, setListError] = React.useState("");

  // Order details state
  const [open, setOpen] = React.useState(false);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [detailsError, setDetailsError] = React.useState("");
  const [orderDetails, setOrderDetails] = React.useState(null);

  // Helper to pick by multiple possible keys
  const pick = (obj, ...keys) => {
    const k = keys.find((kk) => obj && obj[kk] != null);
    return k ? obj[k] : undefined;
  };

  // Fetch all orders
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setListLoading(true);
        setListError("");
        const token = localStorage.getItem("userToken");
        if (!token) return navigate("/login");

        const res = await axios.get(`${BASE_URL}/api/Orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
        setOrders(list);
      } catch (err) {
        if (err?.response?.status === 401) navigate("/login");
        else setListError("Failed to load orders.");
      } finally {
        setListLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  // Open details dialog and fetch order details
  const handleOpenDetails = async (orderId) => {
    try {
      setOpen(true);
      setDetailsError("");
      setDetailsLoading(true);
      setOrderDetails(null);

      const token = localStorage.getItem("userToken");
      if (!token) return navigate("/login");

      const res = await axios.get(`${BASE_URL}/api/Orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails(res.data);
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
      else setDetailsError("Failed to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Close details dialog
  const handleClose = () => {
    setOpen(false);
    setOrderDetails(null);
    setDetailsError("");
  };

  return (
    <Paper sx={{ p: 2,minHeight: '100dvh' }}>
      <Typography variant="h6" mb={2}>Orders</Typography>

      {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}

      {listLoading ? (
        <Stack direction="row" alignItems="center" gap={1.2}>
          <CircularProgress size={20} />
          <Typography>Loading orders…</Typography>
        </Stack>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => {
                const id     = pick(o, "id", "orderId");
                const date   = pick(o, "createdAt", "orderDate", "date");
                const status = pick(o, "status", "orderStatus");

                return (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{String(date || "—")}</TableCell>
                    <TableCell>{status || "—"}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => handleOpenDetails(id)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No orders.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Order details dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Stack direction="row" alignItems="center" gap={1.2}>
              <CircularProgress size={20} />
              <Typography>Loading details…</Typography>
            </Stack>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : !orderDetails ? (
            <Typography color="text.secondary">No data.</Typography>
          ) : (
            <>
              {/* General info */}
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2"><b>Order #:</b> {pick(orderDetails, "id", "orderId") ?? "—"}</Typography>
                  <Typography variant="body2"><b>Date:</b> {String(pick(orderDetails, "createdAt", "orderDate", "date") || "—")}</Typography>
                  <Typography variant="body2"><b>Status:</b> {pick(orderDetails, "status", "orderStatus") || "—"}</Typography>
                  <Typography variant="body2"><b>Total:</b> {pick(orderDetails, "totalPrice", "total", "amount") ?? "—"}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>Shipping</Typography>
                  <Typography variant="body2">
                    {pick(orderDetails, "shippingAddress", "address")?.fullName ||
                     pick(orderDetails, "recipient", "customer")?.name || "—"}
                  </Typography>
                  <Typography variant="body2">
                    {pick(orderDetails, "shippingAddress", "address")?.phone ||
                     pick(orderDetails, "recipient", "customer")?.phone || ""}
                  </Typography>
                  <Typography variant="body2">
                    {[
                      pick(orderDetails, "shippingAddress", "address")?.city,
                      pick(orderDetails, "shippingAddress", "address")?.street
                    ].filter(Boolean).join(" ")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>Customer</Typography>
                  <Typography variant="body2">
                    {pick(orderDetails, "recipient", "customer")?.name ||
                     pick(orderDetails, "recipient", "customer")?.fullName || "—"}
                  </Typography>
                  <Typography variant="body2">
                    {pick(orderDetails, "recipient", "customer")?.email || ""}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              {/* Items */}
              <Typography variant="subtitle1" gutterBottom>Items</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(pick(orderDetails, "items", "orderItems") || []).map((it, idx) => {
                    const name  = pick(it, "name", "title", "productName");
                    const price = Number(pick(it, "price", "unitPrice")) || 0;
                    const qty   = Number(pick(it, "quantity", "qty", "count")) || 1;
                    const sub   = price * qty;
                    return (
                      <TableRow key={it.id || idx}>
                        <TableCell>{name || "—"}</TableCell>
                        <TableCell>{price}</TableCell>
                        <TableCell>{qty}</TableCell>
                        <TableCell>{sub}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
