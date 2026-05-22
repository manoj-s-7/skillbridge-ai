"use client";
import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItem, alpha, useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/theme/ThemeProvider";
import { brand } from "@/theme/theme";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 60 });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(20px)",
          background: trigger ? alpha("#0A0F1E", 0.95) : "transparent",
          borderBottom: trigger ? `1px solid ${alpha("#fff", 0.08)}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar sx={{ maxWidth: "lg", width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, background: `linear-gradient(135deg, #fff, ${brand.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              SkillBridge AI
            </Typography>
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.label} href={link.href} sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
                {link.label}
              </Button>
            ))}
            <IconButton onClick={toggleTheme} size="small" sx={{ mx: 1 }}>
              {mode === "dark" ? <Brightness7Icon sx={{ fontSize: 20 }} /> : <Brightness4Icon sx={{ fontSize: 20 }} />}
            </IconButton>
            <Button variant="outlined" onClick={() => router.push("/login")} sx={{ mr: 1 }}>Sign In</Button>
            <Button variant="contained" onClick={() => router.push("/signup")}>Get Started</Button>
          </Box>

          {/* Mobile menu button */}
          <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 280, p: 2 } } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} sx={{ pb: 0 }}>
              <Button fullWidth href={link.href} onClick={() => setMobileOpen(false)} sx={{ justifyContent: "flex-start" }}>
                {link.label}
              </Button>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Button fullWidth variant="outlined" onClick={() => { setMobileOpen(false); router.push("/login"); }}>Sign In</Button>
          <Button fullWidth variant="contained" onClick={() => { setMobileOpen(false); router.push("/signup"); }}>Get Started</Button>
        </Box>
      </Drawer>
    </>
  );
}
