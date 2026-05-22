"use client";
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem,
  LinearProgress, Chip, List, ListItem, ListItemText, Alert, Grid, alpha, Skeleton,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { skillService } from "@/services/services";
import { brand } from "@/theme/theme";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const TARGET_ROLES = [
  "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Engineer",
  "Android Developer", "iOS Developer", "Data Analyst", "Cybersecurity Analyst",
];

export default function SkillsPage() {
  const qc = useQueryClient();
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["skill-analysis"],
    queryFn: skillService.getLatest,
    retry: false,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => skillService.analyze(targetRole),
    onSuccess: () => {
      toast.success("Skill gap analysis complete!");
      qc.invalidateQueries({ queryKey: ["skill-analysis"] });
      qc.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Analysis failed."),
    onSettled: () => setLoading(false),
  });

  const handleAnalyze = () => {
    if (!targetRole) return toast.error("Please select a target role.");
    setLoading(true);
    analyzeMutation.mutate();
  };

  const priorityColor = (p: string) =>
    p === "high" ? "#EF4444" : p === "medium" ? brand.amber : brand.emerald;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Skill Gap Analyzer</Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Compare your skills against a target role and get a personalized readiness score.
      </Typography>

      {/* Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
            <TextField
              select label="Target Role" value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              sx={{ minWidth: 280 }}
            >
              {TARGET_ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <Button variant="contained" onClick={handleAnalyze} disabled={loading || analyzeMutation.isPending} sx={{ height: 56, px: 4 }}>
              {loading ? "Analyzing..." : "Analyze Skills"}
            </Button>
          </Box>
          {(loading || analyzeMutation.isPending) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>AI is analyzing your skill gaps — may take 20 seconds...</Typography>
              <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading && (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, i) => <Grid size={{ xs: 12, md: 4 }} key={i}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} /></Grid>)}
        </Grid>
      )}

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Grid container spacing={3}>
            {/* Readiness Score */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: "center", p: 2 }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 600 }}>READINESS SCORE</Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 1 }}>for {analysis.target_role}</Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900, my: 2,
                      background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}
                  >
                    {analysis.readiness_score}%
                  </Typography>
                  <LinearProgress variant="determinate" value={analysis.readiness_score} sx={{ height: 10, mb: 2, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${brand.blue}, ${brand.cyan})` } }} />
                  <Chip label={analysis.readiness_score >= 70 ? "Job Ready" : analysis.readiness_score >= 50 ? "Getting There" : "Keep Learning"} color={analysis.readiness_score >= 70 ? "success" : "warning"} />
                </CardContent>
              </Card>
            </Grid>

            {/* Matched Skills */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: brand.emerald }} /> You Have ({analysis.matched_skills?.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {analysis.matched_skills?.map((skill: string) => (
                      <Chip key={skill} label={skill} color="success" size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Missing Skills */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <ErrorIcon sx={{ color: "#EF4444" }} /> Skills to Learn ({analysis.missing_skills?.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {analysis.missing_skills?.slice(0, 8).map((item: any, i: number) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: priorityColor(item.priority), flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>{item.skill}</Typography>
                        <Chip label={item.priority} size="small" sx={{ height: 16, fontSize: "0.65rem", color: priorityColor(item.priority), background: alpha(priorityColor(item.priority), 0.15) }} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>AI Recommendations</Typography>
                  <List dense>
                    {analysis.recommendations?.map((rec: string, i: number) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${i + 1}. ${rec}`}
                          slotProps={{ primary: { style: { fontSize: "0.875rem", color: "#94A3B8" } } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </Box>
  );
}
