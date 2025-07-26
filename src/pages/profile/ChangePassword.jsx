// src/pages/profile/ChangePassword.jsx
import * as React from "react";
import axios from "axios";
import {
  Paper, Typography, Grid, TextField, Button,
  Alert, CircularProgress, InputAdornment, IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://mytshop.runasp.net";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = React.useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return "املئي كل الحقول.";
    }
    if (form.newPassword.length < 8) {
      return "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.";
    }
    if (form.newPassword !== form.confirmPassword) {
      return "تأكيد كلمة المرور لا يطابق الجديدة.";
    }
    if (form.newPassword === form.currentPassword) {
      return "كلمة المرور الجديدة يجب أن تختلف عن الحالية.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("userToken");
      if (!token) return navigate("/login");

      // ⚠️ لو الـSwagger عندك يحدد أسماء مختلفة للحقول، عدّلي هنا.
      const body = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      };

      await axios.patch(`${BASE_URL}/api/Account/ChangePassword`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // لو رجع 405، جرّبي POST:
      // await axios.post(`${BASE_URL}/api/Account/ChangePassword`, body, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess("تم تغيير كلمة المرور بنجاح.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : "");
      setError(serverMsg || "فشل تغيير كلمة المرور. تحققي من البيانات.");
      if (err?.response?.status === 401) navigate("/login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 , minHeight: '100dvh'}}>
      <Typography variant="h6" mb={2}>Change Password</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type={show.current ? "text" : "password"}
              value={form.currentPassword}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {show.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} />

          <Grid item xs={12} md={6}>
            <TextField
              label="New Password"
              name="newPassword"
              type={show.next ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange}
              fullWidth
              required
              helperText="8 أحرف على الأقل"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                      edge="end"
                    >
                      {show.next ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={show.confirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                      edge="end"
                    >
                      {show.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
