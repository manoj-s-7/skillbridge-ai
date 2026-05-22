"use client";
import React from "react";
import { Box, Container, Typography, Button, alpha } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import { brand } from "@/theme/theme";

export default function CTASection() {
  const router = useRouter();
  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <Box
            sx={{
              textAlign: "center",
              p: { xs: 5, md: 8 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(brand.blue, 0.15)}, ${alpha(brand.cyan, 0.08)}, ${alpha(brand.purple, 0.1)})`,
              border: `1px solid ${alpha(brand.blue, 0.3)}`,
              backdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <Box sx={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 400, height: 300, background: brand.blue, filter: "blur(120px)", opacity: 0.1, borderRadius: "50%" }} />

            <Typography variant="overline" sx={{ color: brand.cyan, fontWeight: 700, letterSpacing: 3, fontSize: "0.8rem" }}>
              START TODAY — IT&apos; S FREE
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 900 }}>
              Ready to Land{" "}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Your Dream Job?
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 5, fontWeight: 400 }}>
              Join 10,000+ students and professionals who used SkillBridge AI to accelerate their careers.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push("/signup")}
              sx={{ px: 5, py: 2, fontSize: "1.05rem", borderRadius: 3 }}
            >
              Create Your Free Account
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
