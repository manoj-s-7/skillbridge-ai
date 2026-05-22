"use client";
import React, { useState, useCallback } from "react";
import {
  Box, Card, CardContent, Typography, Button, LinearProgress, Chip,
  List, ListItem, ListItemIcon, ListItemText, Alert, alpha, Skeleton, Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { resumeService } from "@/services/services";
import { brand } from "@/theme/theme";

function ATSGauge({ score }: { score: number }) {
  const color = score >= 80 ? brand.emerald : score >= 60 ? brand.amber : "#EF4444";
  return (
    <Box sx={{ textAlign: "center", p: 3 }}>
      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            width: 120, height: 120, borderRadius: "50%",
            background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Box sx={{ width: 94, height: 94, borderRadius: "50%", bgcolor: "background.paper", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color }}>{score}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>/ 100</Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color }}>
        {score >= 80 ? "Excellent ATS Score" : score >= 60 ? "Good — Room to Improve" : "Needs Improvement"}
      </Typography>
    </Box>
  );
}

export default function ResumePage() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["resume-analysis"],
    queryFn: resumeService.getAnalysis,
    retry: false,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.upload(file),
    onSuccess: () => {
      toast.success("Resume analyzed successfully! ✅");
      qc.invalidateQueries({ queryKey: ["resume-analysis"] });
      qc.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Upload failed. Please try again.");
    },
    onSettled: () => setUploading(false),
  });

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted[0]) return;
    setUploading(true);
    uploadMutation.mutate(accepted[0]);
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1, disabled: uploading,
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Resume Analyzer</Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Upload your PDF resume for AI-powered ATS scoring and improvement suggestions.
      </Typography>

      {/* Upload Zone */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? brand.blue : "rgba(255,255,255,0.15)"}`,
              borderRadius: 3, p: 5, textAlign: "center", cursor: "pointer", transition: "all 0.3s ease",
              background: isDragActive ? `rgba(59,130,246,0.08)` : "transparent",
              "&:hover": { borderColor: brand.blue, background: "rgba(59,130,246,0.05)" },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: isDragActive ? brand.blue : "text.secondary", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              or click to browse — PDF only, max 10MB
            </Typography>
            <Button variant="outlined" size="small" disabled={uploading}>Choose File</Button>
          </Box>
          {(uploading || uploadMutation.isPending) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Analyzing with AI... this may take 15-30 seconds
              </Typography>
              <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {isLoading && (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>ATS Score</Typography>
                  <ATSGauge score={analysis.ats_score} />
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Detected Skills ({analysis.detected_skills?.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {analysis.detected_skills?.map((skill: string) => (
                      <Chip key={skill} label={skill} color="primary" size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <ErrorIcon sx={{ color: "#EF4444" }} /> Issues Found
                  </Typography>
                  <List dense>
                    {analysis.weaknesses?.map((w: string, i: number) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <WarningIcon sx={{ fontSize: 16, color: brand.amber }} />
                        </ListItemIcon>
                        <ListItemText primary={w} slotProps={{ primary: { style: { fontSize: "0.85rem" } } }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <TipsAndUpdatesIcon sx={{ color: brand.emerald }} /> AI Suggestions
                  </Typography>
                  <List dense>
                    {analysis.suggestions?.map((s: string, i: number) => (
                      <ListItem key={i} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: brand.emerald }} />
                        </ListItemIcon>
                        <ListItemText primary={s} slotProps={{ primary: { style: { fontSize: "0.85rem" } } }} />
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
