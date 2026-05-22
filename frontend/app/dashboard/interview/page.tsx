"use client";
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, MenuItem, Button, Chip,
  Grid, LinearProgress, Accordion, AccordionSummary, AccordionDetails, alpha,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { interviewService } from "@/services/services";
import { brand } from "@/theme/theme";

const ROLES = ["Backend Developer", "Frontend Developer", "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Data Analyst"];
const TYPES = [
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
  { value: "hr", label: "HR" },
  { value: "coding", label: "Coding" },
];
const DIFFICULTY_COLORS: Record<string, string> = { easy: brand.emerald, medium: brand.amber, hard: "#EF4444" };
const TYPE_COLORS: Record<string, string> = { technical: brand.blue, behavioral: brand.purple, hr: brand.cyan, coding: brand.pink };

export default function InterviewPage() {
  const [targetRole, setTargetRole] = useState("");
  const [questionTypes, setQuestionTypes] = useState(["technical", "behavioral"]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<any>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const { data: history } = useQuery({ queryKey: ["interview-history"], queryFn: interviewService.getHistory });

  const generateMutation = useMutation({
    mutationFn: () => interviewService.generate(targetRole, questionTypes, numQuestions),
    onSuccess: (data) => {
      setCurrentInterview(data);
      setRevealedAnswers(new Set());
      toast.success(`${data.questions?.length} questions generated!`);
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || "Generation failed."),
    onSettled: () => setLoading(false),
  });

  const toggleType = (type: string) => {
    setQuestionTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };

  const toggleAnswer = (i: number) => {
    setRevealedAnswers((prev) => {
      const s = new Set(prev);
      s.has(i) ? s.delete(i) : s.add(i);
      return s;
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <QuizIcon sx={{ color: brand.amber }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Mock Interview Engine</Typography>
      </Box>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Generate role-specific interview questions with model answers to ace your next interview.
      </Typography>

      {/* Config */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Grid container spacing={2} sx={{ flex: 1 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField select fullWidth label="Target Role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                  {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField select fullWidth label="No. of Questions" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}>
                  {[5, 10, 15, 20].map((n) => <MenuItem key={n} value={n}>{n} questions</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>Question Types</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {TYPES.map((t) => (
                    <Chip
                      key={t.value} label={t.label} clickable
                      onClick={() => toggleType(t.value)}
                      sx={{
                        background: questionTypes.includes(t.value) ? alpha(TYPE_COLORS[t.value], 0.2) : "transparent",
                        border: `1px solid ${questionTypes.includes(t.value) ? TYPE_COLORS[t.value] : alpha("#fff", 0.15)}`,
                        color: questionTypes.includes(t.value) ? TYPE_COLORS[t.value] : "text.secondary",
                        fontWeight: questionTypes.includes(t.value) ? 700 : 400,
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Button variant="contained" sx={{ mt: 2 }} disabled={loading || generateMutation.isPending || !targetRole || !questionTypes.length}
            onClick={() => { setLoading(true); generateMutation.mutate(); }}>
            {loading ? "Generating..." : "Generate Questions"}
          </Button>
          {(loading || generateMutation.isPending) && <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />}
        </CardContent>
      </Card>

      {/* Questions */}
      {currentInterview && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {currentInterview.questions?.length} Questions — {currentInterview.target_role}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {currentInterview.questions?.map((q: any, i: number) => (
              <Accordion key={i} sx={{ background: alpha("#fff", 0.03), border: `1px solid ${alpha("#fff", 0.08)}`, borderRadius: "12px !important", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, pr: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 24, fontWeight: 700 }}>Q{i + 1}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.8 }}>
                        <Chip label={q.category} size="small" sx={{ height: 18, fontSize: "0.65rem", background: alpha(TYPE_COLORS[q.category] || brand.blue, 0.15), color: TYPE_COLORS[q.category] || brand.blue }} />
                        <Chip label={q.difficulty} size="small" sx={{ height: 18, fontSize: "0.65rem", background: alpha(DIFFICULTY_COLORS[q.difficulty] || brand.blue, 0.15), color: DIFFICULTY_COLORS[q.difficulty] || brand.blue }} />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {q.hint && (
                    <Box sx={{ display: "flex", gap: 1, p: 1.5, borderRadius: 2, background: alpha(brand.amber, 0.08), border: `1px solid ${alpha(brand.amber, 0.2)}`, mb: 2 }}>
                      <LightbulbIcon sx={{ color: brand.amber, fontSize: 18, mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}><strong>Hint:</strong> {q.hint}</Typography>
                    </Box>
                  )}
                  <Button size="small" variant={revealedAnswers.has(i) ? "contained" : "outlined"} startIcon={<CheckCircleIcon />} onClick={() => toggleAnswer(i)} sx={{ mb: 2 }}>
                    {revealedAnswers.has(i) ? "Hide Answer" : "Reveal Model Answer"}
                  </Button>
                  {revealedAnswers.has(i) && (
                    <Box sx={{ p: 2, borderRadius: 2, background: alpha(brand.emerald, 0.06), border: `1px solid ${alpha(brand.emerald, 0.2)}` }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{q.model_answer}</Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
