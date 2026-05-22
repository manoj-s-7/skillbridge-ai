"use client";
import React from "react";
import {
  Box, Typography, Card, CardContent, Grid, LinearProgress, Chip, alpha, Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dashboardService } from "@/services/services";
import { brand } from "@/theme/theme";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color, fontWeight: 700 }}>{value}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={value} sx={{ height: 10, borderRadius: 5, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)})`, borderRadius: 5 } }} />
    </Box>
  );
}

export default function ProgressPage() {
  const { data: metrics, isLoading } = useQuery({ queryKey: ["dashboard-metrics"], queryFn: dashboardService.getMetrics });

  const chartData = metrics?.ats_history?.slice().reverse().map((entry: any, i: number) => ({
    name: `Scan ${i + 1}`,
    ATS: entry.ats_score,
  })) || [];

  const readinessScore = metrics?.readiness_score || 0;
  const atsScore = metrics?.ats_score || 0;
  const certScore = metrics?.cert_score || 0;

  const overallScore = Math.round((readinessScore + atsScore + certScore) / 3);
  const overallColor = overallScore >= 70 ? brand.emerald : overallScore >= 50 ? brand.amber : "#EF4444";
  const overallLabel = overallScore >= 80 ? "Job Ready! 🚀" : overallScore >= 60 ? "Almost There!" : overallScore >= 40 ? "Keep Going!" : "Just Starting";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <EmojiEventsIcon sx={{ color: brand.amber }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Progress Tracker</Typography>
      </Box>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>Your end-to-end career readiness at a glance.</Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} /></Grid>)}
        </Grid>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Grid container spacing={3}>
            {/* Overall Score */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: "center", p: 2, background: alpha(overallColor, 0.06), border: `1px solid ${alpha(overallColor, 0.3)}` }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700 }}>OVERALL SCORE</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: overallColor, my: 1 }}>{overallScore}%</Typography>
                  <Chip label={overallLabel} sx={{ background: alpha(overallColor, 0.15), color: overallColor, fontWeight: 700 }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Detailed Scores */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Score Breakdown</Typography>
                  <ProgressBar label="ATS Resume Score" value={atsScore} color={brand.blue} />
                  <ProgressBar label="Skill Readiness" value={readinessScore} color={brand.cyan} />
                  <ProgressBar label="Certification Score" value={certScore} color={brand.purple} />
                </CardContent>
              </Card>
            </Grid>

            {/* Stats */}
            {[
              { label: "Skills Detected", value: metrics?.detected_skills_count || 0, color: brand.blue },
              { label: "Skills to Learn", value: metrics?.missing_skills_count || 0, color: brand.amber },
              { label: "Roadmap Weeks", value: metrics?.roadmap_weeks || 0, color: brand.emerald },
              { label: "Interviews Done", value: metrics?.interview_count || 0, color: brand.purple },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card sx={{ textAlign: "center", p: 1 }}>
                    <CardContent>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color }}>{stat.value}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>{stat.label}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}

            {/* ATS History Chart */}
            {chartData.length > 1 && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>ATS Score History</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: "#0F1629", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                        <Bar dataKey="ATS" fill={brand.blue} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </motion.div>
      )}
    </Box>
  );
}
