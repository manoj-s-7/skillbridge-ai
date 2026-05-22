"use client";
import React from "react";
import { Box, Container, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { brand } from "@/theme/theme";

const steps = [
  { num: "01", title: "Sign Up & Tell Us Your Goals", desc: "Create your account and complete our AI onboarding questionnaire in 3 minutes. Tell us your dream role, skills, and experience." },
  { num: "02", title: "Upload Your Resume", desc: "Upload your PDF resume. Our AI extracts your skills, scores it for ATS compatibility, and identifies areas to improve." },
  { num: "03", title: "Get Your Skill Gap Report", desc: "See exactly which skills you're missing for your target role. Get a readiness score and prioritized action plan." },
  { num: "04", title: "Follow Your AI Roadmap", desc: "Receive a personalized weekly learning plan with real resources, milestones, and portfolio project ideas." },
  { num: "05", title: "Apply to Matched Jobs", desc: "Browse jobs and internships matched to your skills. See your match score and get direct apply links." },
  { num: "06", title: "Ace Your Interviews", desc: "Practice with AI-generated role-specific questions. Get model answers and build confidence to land the job." },
];

export default function HowItWorksSection() {
  return (
    <Box component="section" id="how-it-works" sx={{ py: { xs: 10, md: 14 }, position: "relative" }}>
      <Box
        sx={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `radial-gradient(${brand.blue} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline" sx={{ color: brand.emerald, fontWeight: 700, letterSpacing: 3, fontSize: "0.8rem" }}>
              HOW IT WORKS
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: "2rem", md: "2.8rem" } }}>
              Your Journey to{" "}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brand.emerald}, ${brand.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Employment
              </Box>
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-start",
                  p: 3,
                  borderRadius: 3,
                  background: alpha("#fff", 0.03),
                  border: `1px solid ${alpha("#fff", 0.06)}`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha(brand.blue, 0.06),
                    borderColor: alpha(brand.blue, 0.25),
                    transform: "translateX(8px)",
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    minWidth: 64,
                    fontSize: "2rem",
                    lineHeight: 1,
                    pt: 0.5,
                  }}
                >
                  {step.num}
                </Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{step.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>{step.desc}</Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
