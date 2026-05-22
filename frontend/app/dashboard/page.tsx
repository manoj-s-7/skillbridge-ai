"use client";
import React from "react";
import { Box, Grid, Typography, Card, CardContent, LinearProgress, Skeleton, Chip, alpha, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { dashboardService } from "@/services/services";
import { useAuthStore } from "@/store/auth.store";
import { brand } from "@/theme/theme";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import MapIcon from "@mui/icons-material/Map";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WorkIcon from "@mui/icons-material/Work";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function MetricCard({ title, value, subtitle, color, icon, progress }: any) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{title}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, background: `linear-gradient(135deg, #fff, ${color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {value}
            </Typography>
            {subtitle && <Typography variant="caption" sx={{ color: "text.secondary" }}>{subtitle}</Typography>}
          </Box>
          <Box sx={{ width: 48, height: 48, borderRadius: 2.5, background: alpha(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", color }}>
            {icon}
          </Box>
        </Box>
        {progress !== undefined && (
          <LinearProgress variant="determinate" value={progress} sx={{ "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})` } }} />
        )}
      </CardContent>
    </Card>
  );
}

function QuickAction({ label, desc, icon, path, color }: any) {
  const router = useRouter();
  return (
    <Card
      sx={{ cursor: "pointer", "&:hover": { borderColor: alpha(color, 0.4) } }}
      onClick={() => router.push(path)}
    >
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box sx={{ width: 44, height: 44, borderRadius: 2, background: alpha(color, 0.15), display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{label}</Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>{desc}</Typography>
        </Box>
        <ArrowForwardIcon sx={{ color: "text.secondary", fontSize: 18 }} />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: dashboardService.getMetrics,
  });

  const quickActions = [
    { label: "Upload Resume", desc: "Get your ATS score", icon: <DescriptionIcon />, path: "/dashboard/resume", color: brand.blue },
    { label: "Analyze Skills", desc: "Check your readiness", icon: <TrendingUpIcon />, path: "/dashboard/skills", color: brand.cyan },
    { label: "Generate Roadmap", desc: "Build your learning plan", icon: <MapIcon />, path: "/dashboard/roadmap", color: brand.emerald },
    { label: "Find Jobs", desc: "See your matches", icon: <WorkIcon />, path: "/dashboard/jobs", color: brand.purple },
    { label: "Mock Interview", desc: "Practice questions", icon: <QuizIcon />, path: "/dashboard/interview", color: brand.amber },
    { label: "AI Mentor", desc: "Chat with your coach", icon: <SmartToyIcon />, path: "/dashboard/mentor", color: brand.pink },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            Here&apos;s your career readiness overview.
          </Typography>
        </Box>
      </motion.div>

      {/* Onboarding nudge */}
      {metrics && !metrics.has_resume && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card sx={{ mb: 3, p: 1, background: alpha(brand.blue, 0.08), border: `1px solid ${alpha(brand.blue, 0.3)}` }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>🚀 Upload your resume to get started</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Get your ATS score, detect your skills, and unlock personalized recommendations.</Typography>
              </Box>
              <Button variant="contained" size="small" onClick={() => router.push("/dashboard/resume")}>Upload Resume</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <MetricCard title="ATS Score" value={`${metrics?.ats_score ?? 0}%`} subtitle="Resume compatibility" color={brand.blue} icon={<DescriptionIcon />} progress={metrics?.ats_score ?? 0} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <MetricCard title="Readiness Score" value={`${metrics?.readiness_score ?? 0}%`} subtitle={metrics?.target_role || "No role set"} color={brand.cyan} icon={<TrendingUpIcon />} progress={metrics?.readiness_score ?? 0} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <MetricCard title="Skills Detected" value={metrics?.detected_skills_count ?? 0} subtitle="From your resume" color={brand.emerald} icon={<TrendingUpIcon />} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <MetricCard title="Mentor Chats" value={metrics?.chat_count ?? 0} subtitle="AI conversations" color={brand.pink} icon={<SmartToyIcon />} />
              </motion.div>
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
      <Grid container spacing={2}>
        {quickActions.map((action, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={action.label}>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <QuickAction {...action} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
