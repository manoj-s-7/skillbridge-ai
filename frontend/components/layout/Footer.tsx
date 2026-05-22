"use client";
import React from "react";
import { Box, Container, Typography, Grid, Link, Divider, alpha } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { brand } from "@/theme/theme";

const footerLinks = {
  Platform: ["Resume Analyzer", "Skill Gap Analysis", "Learning Roadmap", "Job Finder", "AI Mentor"],
  Company: ["About Us", "Careers", "Blog", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 8, borderTop: `1px solid ${alpha("#fff", 0.06)}` }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: "#fff" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>SkillBridge AI</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 280, lineHeight: 1.8 }}>
              From learning to hiring — your AI career copilot. Helping students and job seekers become employment-ready.
            </Typography>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>{category}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {links.map((link) => (
                  <Link key={link} href="#" underline="none" sx={{ color: "text.secondary", fontSize: "0.85rem", "&:hover": { color: brand.blue } }}>
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            © 2026 SkillBridge AI. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Powered by Gemini 2.5 Flash · Built for India's Tech Talent
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
