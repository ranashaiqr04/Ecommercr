// src/pages/profile/Profile.jsx
import * as React from "react";
import { Outlet } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";

export default function Profile() {
  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
    

      {/* هنا تتعرض الصفحات الفرعية */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
