"use client";
import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, alpha } from "@mui/material";
import { motion } from "framer-motion";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MapIcon from "@mui/icons-material/Map";
import WorkIcon from "@mui/icons-material/Work";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import QuizIcon from "@mui/icons-material/Quiz";
import { brand } from "@/theme/theme";

const features = [
  {
    icon: <DocumentScannerIcon sx={{ fontSize: 32 }} />,
    title: "Resume Analyzer",
    description: "Upload your PDF resume and get instant ATS score, skill detection, weaknesses, and actionable improvement suggestions.",
    color: brand.blue,
    gradient: `linear-gradient(135deg, ${brand.blue}, #60A5FA)`,
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    title: "Skill Gap Analysis",
    description: "Compare your current skills against your target role. Get a readiness score and prioritized learning recommendations.",
    color: brand.cyan,
    gradient: `linear-gradient(135deg, ${brand.cyan}, #67E8F9)`,
  },
  {
    icon: <MapIcon sx={{ fontSize: 32 }} />,
    title: "AI Learning Roadmap",
    description: "Get a personalized weekly learning plan with curated resources, milestones, and portfolio project ideas.",
    color: brand.emerald,
    gradient: `linear-gradient(135deg, ${brand.emerald}, #34D399)`,
  },
  {
    icon: <WorkIcon sx={{ fontSize: 32 }} />,
    title: "Job & Internship Engine",
    description: "Discover opportunities matched to your skills, domain, and location. See your match score for every listing.",
    color: brand.purple,
    gradient: `linear-gradient(135deg, ${brand.purple}, #A78BFA)`,
  },
  {
    icon: <SmartToyIcon sx={{ fontSize: 32 }} />,
    title: "AI Career Mentor",
    description: "Chat with your personal AI career coach 24/7. Get career advice, roadmap help, and interview tips instantly.",
    color: brand.pink,
    gradient: `linear-gradient(135deg, ${brand.pink}, #F9A8D4)`,
  },
  {
    icon: <QuizIcon sx={{ fontSize: 32 }} />,
    title: "Mock Interview Engine",
    description: "Generate role-specific technical, behavioral, and HR questions with model answers to ace your interviews.",
    color: brand.amber,
    gradient: `linear-gradient(135deg, ${brand.amber}, #FCD34D)`,
  },
];

export default function FeaturesSection() {
  return (
    <Box component="section" id="features" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{ color: brand.blue, fontWeight: 700, letterSpacing: 3, fontSize: "0.8rem" }}
            >
              EVERYTHING YOU NEED
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: "2rem", md: "2.8rem" } }}>
              One Platform.{" "}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Infinite Possibilities.
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: 560, mx: "auto", fontWeight: 400 }}>
              12 AI-powered tools to take you from zero to employed.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 1,
                    cursor: "default",
                    "&:hover .feature-icon": { transform: "scale(1.1) rotate(-3deg)" },
                  }}
                >
                  <CardContent>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        background: feature.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        color: "#fff",
                        transition: "transform 0.3s ease",
                        boxShadow: `0 8px 24px ${alpha(feature.color, 0.35)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
