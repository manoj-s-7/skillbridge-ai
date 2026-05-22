"use client";
import React, { useState, useEffect } from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, IconButton, AppBar, Toolbar, Tooltip, alpha, useMediaQuery, useTheme, Divider, Chip } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MapIcon from "@mui/icons-material/Map";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuthStore } from "@/store/auth.store";
import { useThemeMode } from "@/theme/ThemeProvider";
import { brand } from "@/theme/theme";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Resume", icon: <DescriptionIcon />, path: "/dashboard/resume" },
  { label: "Skill Analysis", icon: <TrendingUpIcon />, path: "/dashboard/skills" },
  { label: "Roadmap", icon: <MapIcon />, path: "/dashboard/roadmap" },
  { label: "Jobs", icon: <WorkIcon />, path: "/dashboard/jobs" },
  { label: "Internships", icon: <SchoolIcon />, path: "/dashboard/internships" },
  { label: "Mock Interview", icon: <QuizIcon />, path: "/dashboard/interview" },
  { label: "AI Mentor", icon: <SmartToyIcon />, path: "/dashboard/mentor", badge: "AI" },
  { label: "Progress", icon: <BarChartIcon />, path: "/dashboard/progress" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeMode();
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const DrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 1.5 }}>
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, mb: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AutoAwesomeIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>SkillBridge AI</Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Nav */}
      <List dense sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => { router.push(item.path); if (isMobile) setMobileOpen(false); }}
              sx={{ mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? brand.blue : "text.secondary" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: active ? 700 : 500 } } as any }}
              />
              {item.badge && (
                <Chip label={item.badge} size="small" sx={{ height: 18, fontSize: "0.65rem", background: alpha(brand.blue, 0.2), color: brand.blue }} />
              )}
            </ListItemButton>
          );
        })}

        {/* Admin link */}
        {user?.role === "admin" && (
          <ListItemButton onClick={() => router.push("/admin")} selected={pathname.startsWith("/admin")} sx={{ mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}><AdminPanelSettingsIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary={"Admin"} slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: 500 } } as any }} />
          </ListItemButton>
        )}
      </List>

      <Divider sx={{ mb: 1.5 }} />

      {/* User info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, background: alpha("#fff", 0.04) }}>
        <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, fontSize: "0.9rem", fontWeight: 700 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>{user?.name}</Typography>
          <Typography variant="caption" noWrap sx={{ color: "text.secondary", display: "block" }}>{user?.role}</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={handleLogout} sx={{ color: "text.secondary" }}><LogoutIcon sx={{ fontSize: 18 }} /></IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Permanent drawer (desktop) */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", md: "block" }, width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        open
      >
        {DrawerContent}
      </Drawer>

      {/* Temporary drawer (mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
      >
        {DrawerContent}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile appbar */}
        <AppBar position="sticky" elevation={0} sx={{ display: { md: "none" } }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}><MenuIcon /></IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>SkillBridge AI</Typography>
            <IconButton onClick={toggleTheme}>{mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: "auto" }}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
