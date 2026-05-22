"use client";
import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip, LinearProgress, Button, alpha, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import { jobService } from "@/services/services";
import { brand } from "@/theme/theme";

function JobCard({ job, index }: { job: any; index: number }) {
  const scoreColor = job.match_score >= 70 ? brand.emerald : job.match_score >= 50 ? brand.amber : "#EF4444";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card sx={{ height: "100%", cursor: "default" }}>
        <CardContent>
          {job.match_score != null && (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
              <Chip label={`${job.match_score}% Match`} size="small" sx={{ background: alpha(scoreColor, 0.15), color: scoreColor, fontWeight: 700 }} />
              <Chip label={job.job_type} size="small" variant="outlined" />
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>{job.title}</Typography>
          <Box sx={{ display: "flex", gap: 2, color: "text.secondary", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.82rem" }}>
              <BusinessIcon sx={{ fontSize: 14 }} />{job.company}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.82rem" }}>
              <LocationOnIcon sx={{ fontSize: 14 }} />{job.location}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6, fontSize: "0.82rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {job.description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {job.skills_required?.slice(0, 4).map((skill: string) => (
              <Chip key={skill} label={skill} size="small" color="primary" sx={{ fontSize: "0.7rem", height: 20 }} />
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {job.salary_range && <Typography variant="caption" sx={{ color: brand.emerald, fontWeight: 700 }}>{job.salary_range}</Typography>}
            <Button size="small" variant="outlined" href={job.apply_url || "#"} target="_blank">Apply →</Button>
          </Box>
          {job.match_score != null && (
            <Box sx={{ mt: 1.5 }}>
              <LinearProgress variant="determinate" value={job.match_score}
                sx={{ height: 4, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${scoreColor}, ${alpha(scoreColor, 0.7)})` } }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function JobsPage() {
  const { data: recommended, isLoading: rLoading } = useQuery({ queryKey: ["jobs-recommended"], queryFn: () => jobService.getRecommended(12) });
  const { data: allJobs, isLoading: aLoading } = useQuery({ queryKey: ["jobs-all"], queryFn: () => jobService.getAll() });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <WorkIcon sx={{ color: brand.blue }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Job Opportunities</Typography>
      </Box>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>Jobs matched to your skills and preferences.</Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🎯 Recommended for You</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {rLoading ? [...Array(6)].map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} /></Grid>)
          : recommended?.map((job: any, i: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job.id || i}><JobCard job={job} index={i} /></Grid>
          ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>All Jobs</Typography>
      <Grid container spacing={3}>
        {aLoading ? [...Array(6)].map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} /></Grid>)
          : allJobs?.jobs?.map((job: any, i: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job.id || i}><JobCard job={job} index={i} /></Grid>
          ))}
      </Grid>
    </Box>
  );
}
