"use client";
import React, { useState } from "react";
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { brand } from "@/theme/theme";

const faqs = [
  { q: "Is SkillBridge AI free to use?", a: "Yes! You can sign up and access core features for free. We offer premium plans for advanced AI mentor sessions and unlimited roadmap generation." },
  { q: "Which AI models power SkillBridge?", a: "We use Google Gemini 2.5 Flash as our primary AI with Groq Llama 3.3 as automatic fallback, ensuring 99.9% uptime for all AI features." },
  { q: "How accurate is the resume ATS score?", a: "Our ATS scoring is calibrated against real ATS systems used by top Indian and global companies. Scores correlate strongly with actual callback rates." },
  { q: "Can I use SkillBridge if I'm a complete beginner?", a: "Absolutely. SkillBridge is designed for students, freshers, and career switchers. Our AI adapts recommendations to your current level." },
  { q: "How is the skill gap analysis calculated?", a: "The AI compares your listed skills against a continuously updated database of job requirement patterns for 50+ tech roles sourced from job postings." },
  { q: "Is my resume data secure?", a: "Yes. Resume files are encrypted at rest, never sold or shared, and you can delete all your data at any time from your account settings." },
  { q: "How long does the onboarding take?", a: "The onboarding questionnaire takes about 3-5 minutes. After that, your first AI analysis is ready within 30 seconds." },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<number | false>(0);
  return (
    <Box component="section" id="faq" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Typography variant="overline" sx={{ color: brand.amber, fontWeight: 700, letterSpacing: 3, fontSize: "0.8rem" }}>
              FAQ
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: "2rem", md: "2.8rem" } }}>
              Got Questions?
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
              <Accordion
                expanded={expanded === i}
                onChange={() => setExpanded(expanded === i ? false : i)}
                sx={{
                  background: alpha("#fff", 0.04),
                  border: `1px solid ${expanded === i ? alpha(brand.blue, 0.4) : alpha("#fff", 0.07)}`,
                  borderRadius: "12px !important",
                  "&:before": { display: "none" },
                  transition: "all 0.3s ease",
                  boxShadow: expanded === i ? `0 4px 24px ${alpha(brand.blue, 0.12)}` : "none",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: brand.blue }} />}
                  sx={{ "& .MuiAccordionSummary-content": { my: 1.5 } }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: expanded === i ? brand.blue : "text.primary" }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
