// src/pages/profile/Info.jsx
import * as React from "react";
import axios from "axios";
import {
  Paper, Stack, Avatar, Typography, CircularProgress, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://mytshop.runasp.net";

export default function Info() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error,   setError]   = React.useState("");
  const [user,    setUser]    = React.useState({
    name: "", email: "", avatarUrl: ""
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("userToken");
        if (!token) return navigate("/login");

        const res = await axios.get(`${BASE_URL}/api/Account/userinfo`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const d = res.data || {};
        const pick = (...keys) => {
          const k = keys.find((key) => d?.[key] != null);
          return k ? d[k] : "";
        };

        setUser({
          name:     pick("fullName", "name", "userName", "username"),
          email:    pick("email", "emailAddress"),
          avatarUrl:pick("avatarUrl", "imageUrl", "photoUrl")
        });
      } catch (err) {
        if (err?.response?.status === 401) navigate("/login");
        else setError("فشل تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <CircularProgress size={24} />
        <Typography>جارِ التحميل…</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 , minHeight: '100dvh' }} >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={user.avatarUrl || undefined}
          alt={user.name}
          sx={{ width: 88, height: 88, fontSize: 28 }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>

        <Stack>
          <Typography variant="h6">{user.name || "—"}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email || "—"}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
