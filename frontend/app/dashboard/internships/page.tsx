"use client";
import React from "react";
import { Box, Typography, Card, CardContent, Grid, Chip, Button, alpha, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { internshipService } from "@/services/services";
import { brand } from "@/theme/theme";

function InternshipCard({ item, index }: { item: any; index: number }) {
  const scoreColor = item.match_score >= 70 ? brand.emerald : item.match_score >= 50 ? brand.amber : "#EF4444";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          {item.match_score != null && (
            <Chip label={`${item.match_score}% Match`} size="small" sx={{ mb: 1.5, background: alpha(scoreColor, 0.15), color: scoreColor, fontWeight: 700 }} />
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{item.title}</Typography>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1.5 }}>{item.company}</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, color: "text.secondary", fontSize: "0.8rem", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><LocationOnIcon sx={{ fontSize: 14 }} />{item.location}</Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><AccessTimeIcon sx={{ fontSize: 14 }} />{item.duration}</Box>
            {item.stipend && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><AttachMoneyIcon sx={{ fontSize: 14 }} />{item.stipend}</Box>}
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, fontSize: "0.82rem", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {item.description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {item.skills_required?.slice(0, 4).map((s: string) => <Chip key={s} label={s} size="small" color="secondary" sx={{ fontSize: "0.7rem", height: 20 }} />)}
          </Box>
          <Button size="small" variant="outlined" fullWidth href={item.apply_url || "#"} target="_blank">Apply Now →</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function InternshipsPage() {
  const { data: recommended, isLoading: rLoading } = useQuery({ queryKey: ["internships-recommended"], queryFn: () => internshipService.getRecommended(12) });
  const { data: all, isLoading: aLoading } = useQuery({ queryKey: ["internships-all"], queryFn: () => internshipService.getAll() });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <SchoolIcon sx={{ color: brand.cyan }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Internship Finder</Typography>
      </Box>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>Internships matched to your skills, domain, and location preferences.</Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🎯 Best Matches for You</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {rLoading ? [...Array(6)].map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} /></Grid>)
          : recommended?.map((item: any, i: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id || i}><InternshipCard item={item} index={i} /></Grid>
          ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>All Internships</Typography>
      <Grid container spacing={3}>
        {aLoading ? [...Array(6)].map((_, i) => <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} /></Grid>)
          : all?.internships?.map((item: any, i: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id || i}><InternshipCard item={item} index={i} /></Grid>
          ))}
      </Grid>
    </Box>
  );
}
