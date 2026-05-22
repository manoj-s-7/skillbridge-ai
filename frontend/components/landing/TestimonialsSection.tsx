"use client";
import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, alpha } from "@mui/material";
import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import { brand } from "@/theme/theme";

const testimonials = [
  { name: "Priya Sharma", role: "SDE @ Google India", avatar: "PS", quote: "SkillBridge AI identified exactly what I was missing for a Google interview. The AI mentor and mock interviews gave me real confidence. Got the offer in 3 months!", rating: 5 },
  { name: "Arjun Mehta", role: "Data Scientist @ Flipkart", avatar: "AM", quote: "The skill gap analysis was incredibly accurate. The roadmap it generated helped me go from zero ML knowledge to landing a Data Science role at Flipkart.", rating: 5 },
  { name: "Sneha Patel", role: "Frontend Dev @ Razorpay", avatar: "SP", quote: "I was stuck in a non-tech role wanting to switch. SkillBridge AI's roadmap and project ideas helped me build a portfolio that got me 4 interviews in a month!", rating: 5 },
  { name: "Rahul Verma", role: "Cloud Eng @ AWS", avatar: "RV", quote: "The ATS resume score was eye-opening. My resume was at 42 — after following the suggestions, it jumped to 87. Calls started coming within 2 weeks.", rating: 5 },
  { name: "Ananya Singh", role: "ML Intern @ Microsoft", avatar: "AS", quote: "As a second-year student with no experience, I had no idea where to start. SkillBridge mapped out exactly what to learn and I landed a Microsoft internship!", rating: 5 },
  { name: "Karthik Raj", role: "Backend Dev @ PhonePe", avatar: "KR", quote: "The AI mentor chat is insane. I asked it everything from DSA prep to salary negotiation. It felt like having a senior engineer as a personal guide.", rating: 5 },
];

export default function TestimonialsSection() {
  return (
    <Box component="section" id="testimonials" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline" sx={{ color: brand.purple, fontWeight: 700, letterSpacing: 3, fontSize: "0.8rem" }}>
              SUCCESS STORIES
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: "2rem", md: "2.8rem" } }}>
              Real People.{" "}
              <Box component="span" sx={{ background: `linear-gradient(135deg, ${brand.purple}, ${brand.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Real Results.
              </Box>
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((t, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.name}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >
                <Card sx={{ height: "100%", p: 1 }}>
                  <CardContent>
                    <FormatQuoteIcon sx={{ color: brand.purple, fontSize: 40, mb: 1, opacity: 0.7 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 3, fontStyle: "italic" }}>
                      &ldquo;{t.quote}&rdquo;
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.4, mb: 2 }}>
                      {[...Array(t.rating)].map((_, j) => (
                        <StarIcon key={j} sx={{ color: brand.amber, fontSize: 16 }} />
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, fontWeight: 700, width: 44, height: 44, fontSize: "0.9rem" }}>
                        {t.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                        <Typography variant="caption" sx={{ color: brand.cyan }}>{t.role}</Typography>
                      </Box>
                    </Box>
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
