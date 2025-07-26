import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, useNavigate } from "react-router-dom";

// المصفوفتان
const pageGuest = ["Register", "Login","Category"];
const pageAuth  = ["Cart",,"Category"];

// عناصر البروفايل التي تريدينها في السلايدر
const profileItems = [
  { label: "Info",            to: "/profile/info" },
  { label: "Change Password", to: "/profile/change-password" },
  { label: "Orders",          to: "/profile/orders" },
];

export default function Navbar() {
  const [anchorNav, setAnchorNav]   = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null); // (غير مستخدم الآن، ممكن تبقيه)

  const navigate   = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));
  const pages      = isLoggedIn ? pageAuth : pageGuest;

  const [openSlider, setOpenSlider] = React.useState(false);

  // فتح/إغلاق قوائم التنقّل
  const handleOpenNavMenu  = (event) => setAnchorNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorNav(null);

  const handleOpenUserMenu  = (event) => setAnchorUser(event.currentTarget); // (غير مستخدم)
  const handleCloseUserMenu = () => setAnchorUser(null);                     // (غير مستخدم)

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setOpenSlider(false);       // يقفل السلايدر
    navigate("/login");         // يوجّه لصفحة الدخول
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* شعار ≥ md */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* زر الهامبرغر ≤ md */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorNav}
              open={Boolean(anchorNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  component={Link}
                  to={`/${page}`}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* شعار ≤ md */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* روابط ≥ md */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page}`}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}

            {isLoggedIn ? (
              <Button onClick={handleLogout} sx={{ my: 2, color: "white", display: "block" }}>
                Logout
              </Button>
            ) : null}
          </Box>

          {/* صورة المستخدم (للمسجّلين) → يفتح Drawer */}
          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={() => setOpenSlider(true)} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Drawer
                anchor="right"
                open={openSlider}
                onClose={() => setOpenSlider(false)}
                sx={{ "& .MuiDrawer-paper": { width: 280 } }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Profile
                  </Typography>
                </Box>
                <Divider />
                <List>
                  {profileItems.map((item) => (
                    <ListItemButton
                      key={item.to}
                      component={Link}
                      to={item.to}
                      onClick={() => setOpenSlider(false)} // يقفل السلايدر بعد التنقل
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </Drawer>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
