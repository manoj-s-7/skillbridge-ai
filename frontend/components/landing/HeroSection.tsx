"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { brand } from "@/theme/theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const stats = [
  { value: "10,000+", label: "Students Helped" },
  { value: "87%",     label: "Job Placement Rate" },
  { value: "500+",    label: "Companies Hiring" },
  { value: "3 min",   label: "Avg Onboarding" },
];

export default function HeroSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      router.push(`/signup?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <Box
      component="section"
      className="sb-grid-bg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 14, md: 16 },
        pb: 8,
        background: "linear-gradient(180deg, #0A0F1E 0%, #0D1117 100%)",
      }}
    >
      {/* Glow orbs */}
      <Box className="sb-hero-glow" sx={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "900px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(ellipse, #3b82f6 0%, #06b6d4 40%, transparent 70%)",
        filter: "blur(80px)", opacity: 0.12, pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", top: "20%", left: "5%",
        width: 300, height: 300, borderRadius: "50%",
        background: brand.purple, filter: "blur(120px)", opacity: 0.07, pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", top: "40%", right: "5%",
        width: 250, height: 250, borderRadius: "50%",
        background: brand.cyan, filter: "blur(100px)", opacity: 0.07, pointerEvents: "none",
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", maxWidth: 900, mx: "auto" }}>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              px: 2, py: 0.75, borderRadius: "999px", mb: 4,
              background: alpha(brand.blue, 0.1),
              border: `1px solid ${alpha(brand.blue, 0.3)}`,
              color: "#60A5FA", fontSize: "0.78rem", fontWeight: 600,
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", animation: "pulse 2s ease infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
              Powered by Gemini 2.5 Flash AI
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", sm: "4rem", md: "5.2rem" },
                fontWeight: 900,
                lineHeight: 1.08,
                mb: 3,
                letterSpacing: "-0.02em",
              }}
            >
              <Box component="span" sx={{ color: "#F1F5F9" }}>From Learning </Box>
              <Box component="span" className="sb-gradient-text">to Hiring</Box>
            </Typography>
          </motion.div>

          {/* Subtext */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Typography variant="h5" sx={{
              color: "#94A3B8", mb: 6, maxWidth: 620, mx: "auto",
              lineHeight: 1.7, fontWeight: 400, fontSize: { xs: "1rem", md: "1.2rem" },
            }}>
              Your AI career copilot. Analyze your resume, close skill gaps, get
              personalized roadmaps, and land your dream role — all in one place.
            </Typography>
          </motion.div>

          {/* Email CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{
              display: "flex", flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 0 }, justifyContent: "center",
              alignItems: "center", mb: 3,
            }}>
              <Box sx={{
                display: "flex", alignItems: "stretch",
                borderRadius: "12px", overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(13,22,40,0.8)",
              }}>
                <Box
                  component="input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  sx={{
                    background: "transparent", border: "none", outline: "none",
                    px: 2.5, py: 1.8, fontSize: "0.875rem",
                    color: "#F1F5F9", width: { xs: "260px", sm: "280px" },
                    "&::placeholder": { color: "#475569" },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 0, px: 3, py: 1.8, fontWeight: 700,
                    fontSize: "0.875rem", whiteSpace: "nowrap",
                    background: submitted ? "#10B981" : "linear-gradient(135deg, #3B82F6, #2563EB)",
                    boxShadow: "none",
                    "&:hover": { transform: "none", background: submitted ? "#10B981" : "linear-gradient(135deg, #60A5FA, #3B82F6)" },
                  }}
                >
                  {submitted ? "✓ Done!" : "Start Free"}
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
              {["No credit card required", "Free to start", "AI-powered analysis"].map((t) => (
                <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: "0.75rem", color: "#64748B" }}>
                  <CheckCircleIcon sx={{ fontSize: 13, color: "#10B981" }} />
                  {t}
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            <Box sx={{
              mt: 10, pt: 8,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 4,
            }}>
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography className="sb-gradient-text" sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 900, mb: 0.5 }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "#64748B" }}>{s.label}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
