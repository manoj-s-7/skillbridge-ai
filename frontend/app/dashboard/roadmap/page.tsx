"use client";
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, Button, TextField, MenuItem,
  LinearProgress, Chip, Grid, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, alpha, Skeleton,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import { roadmapService } from "@/services/services";
import { brand } from "@/theme/theme";

const ROLES = [
  "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Engineer",
  "Android Developer", "iOS Developer", "Data Analyst",
];

export default function RoadmapPage() {
  const qc = useQueryClient();
  const [targetRole, setTargetRole] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | false>(0);

  const { data: roadmap, isLoading } = useQuery({
    queryKey: ["roadmap"],
    queryFn: roadmapService.get,
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: () => roadmapService.generate(targetRole, durationWeeks),
    onSuccess: () => {
      toast.success("Roadmap generated! 🗺️");
      qc.invalidateQueries({ queryKey: ["roadmap"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Generation failed."),
    onSettled: () => setLoading(false),
  });

  const handleGenerate = () => {
    if (!targetRole) return toast.error("Please select a target role.");
    setLoading(true);
    generateMutation.mutate();
  };

  const weekColor = (week: number) => {
    const colors = [brand.blue, brand.cyan, brand.emerald, brand.purple, brand.pink, brand.amber];
    return colors[week % colors.length];
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>AI Learning Roadmap</Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Generate a personalized weekly learning plan to reach your dream role.
      </Typography>

      {/* Generator */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
            <TextField select label="Target Role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} sx={{ minWidth: 250 }}>
              {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            <TextField select label="Duration" value={durationWeeks} onChange={(e) => setDurationWeeks(Number(e.target.value))} sx={{ minWidth: 150 }}>
              {[4, 8, 12, 16, 24].map((w) => <MenuItem key={w} value={w}>{w} weeks</MenuItem>)}
            </TextField>
            <Button variant="contained" onClick={handleGenerate} disabled={loading || generateMutation.isPending} sx={{ height: 56, px: 4 }}>
              {loading ? "Generating..." : "Generate Roadmap"}
            </Button>
          </Box>
          {(loading || generateMutation.isPending) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>AI is building your personalized roadmap...</Typography>
              <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Roadmap Display */}
      {isLoading && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[...Array(5)].map((_, i) => <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />)}
        </Box>
      )}

      {roadmap && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Summary cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 1, background: alpha(brand.blue, 0.08), border: `1px solid ${alpha(brand.blue, 0.2)}` }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: brand.blue, fontWeight: 700 }}>Target Role</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{roadmap.target_role}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 1, background: alpha(brand.cyan, 0.08), border: `1px solid ${alpha(brand.cyan, 0.2)}` }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: brand.cyan, fontWeight: 700 }}>Duration</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{roadmap.duration_weeks} Weeks</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 1, background: alpha(brand.emerald, 0.08), border: `1px solid ${alpha(brand.emerald, 0.2)}` }}>
                <CardContent>
                  <Typography variant="overline" sx={{ color: brand.emerald, fontWeight: 700 }}>Milestones</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{roadmap.key_milestones?.length || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Weekly plan */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📅 Weekly Plan</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {roadmap.weekly_plan?.map((week: any, i: number) => (
              <Accordion
                key={week.week}
                expanded={expanded === i}
                onChange={() => setExpanded(expanded === i ? false : i)}
                sx={{ background: alpha("#fff", 0.03), border: `1px solid ${alpha("#fff", 0.07)}`, borderRadius: "12px !important", "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, background: alpha(weekColor(i), 0.2), display: "flex", alignItems: "center", justifyContent: "center", color: weekColor(i), fontWeight: 800, fontSize: "0.8rem" }}>
                      W{week.week}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{week.title}</Typography>
                      {week.milestone && <Chip label={week.milestone} size="small" sx={{ height: 16, fontSize: "0.65rem", mt: 0.3 }} />}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>Tasks</Typography>
                      <List dense>
                        {week.tasks?.map((task: string, j: number) => (
                          <ListItem key={j} sx={{ px: 0 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 14, color: brand.emerald, mr: 1 }} />
                            <ListItemText primary={task} slotProps={{ primary: { style: { fontSize: "0.82rem" } } }} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}>Resources</Typography>
                      <List dense>
                        {week.resources?.map((res: string, j: number) => (
                          <ListItem key={j} sx={{ px: 0 }}>
                            <ListItemText primary={res} slotProps={{ primary: { style: { fontSize: "0.82rem", color: brand.blue } } }} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Key milestones */}
          {roadmap.key_milestones?.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🏆 Key Milestones</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {roadmap.key_milestones.map((m: string, i: number) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, background: alpha(brand.emerald, 0.06), border: `1px solid ${alpha(brand.emerald, 0.2)}` }}>
                    <FlagIcon sx={{ color: brand.emerald, fontSize: 18 }} />
                    <Typography variant="body2">{m}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </motion.div>
      )}
    </Box>
  );
}
