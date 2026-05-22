"use client";
import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, Stepper, Step,
  StepLabel, Chip, MenuItem, Grid, LinearProgress, alpha,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { onboardingService } from "@/services/services";
import { useAuthStore } from "@/store/auth.store";
import { brand } from "@/theme/theme";

const STEPS = ["Personal Info", "Skills & Goals", "Preferences"];

const ALL_SKILLS = ["Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "Spring Boot", "SQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Machine Learning", "Deep Learning", "C++", "Go", "Kotlin", "Swift", "HTML", "CSS", "Git", "Linux", "REST APIs", "GraphQL", "TensorFlow", "PyTorch", "Data Analysis", "Figma", "Tableau", "Power BI"];

const schema = z.object({
  full_name: z.string().min(2, "Required"),
  education: z.string().min(2, "Required"),
  institution: z.string().min(2, "Required"),
  graduation_year: z.number().min(2000, "Invalid year").max(2030, "Invalid year"),
  dream_role: z.string().min(2, "Required"),
  preferred_domain: z.string().min(2, "Required"),
  preferred_location: z.string().min(2, "Required"),
  experience_level: z.string(),
  coding_preference: z.string(),
  company_preference: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const updateUser = useAuthStore((s) => s.updateUser);
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { experience_level: "fresher", coding_preference: "coding", company_preference: "both" },
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const nextStep = async () => {
    const fields: any = [
      ["full_name", "education", "institution", "graduation_year"],
      [],
      ["dream_role", "preferred_domain", "preferred_location", "experience_level"],
    ][step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    if (selectedSkills.length === 0) return toast.error("Please select at least one skill.");
    setLoading(true);
    try {
      await onboardingService.submit({ ...data, current_skills: selectedSkills });
      updateUser({ onboarding_complete: true });
      toast.success("Profile created! Let's get you hired 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: brand.blue, filter: "blur(140px)", opacity: 0.08 }} />
      <Box sx={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: brand.cyan, filter: "blur(120px)", opacity: 0.08 }} />

      <Box sx={{ width: "100%", maxWidth: 700, position: "relative" }}>
        {/* Logo + header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 24, color: "#fff" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Set Up Your Profile</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>3 quick steps to unlock your personalized AI career plan</Typography>
        </Box>

        {/* Progress */}
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 3, height: 6, borderRadius: 3, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${brand.blue}, ${brand.cyan})` } }} />

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        <Card sx={{ p: 1 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <AnimatePresence mode="wait">
                {/* Step 0: Personal Info */}
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>👤 Tell us about yourself</Typography>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" {...register("full_name")} error={!!errors.full_name} helperText={errors.full_name?.message} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Degree / Education" placeholder="B.Tech Computer Science" {...register("education")} error={!!errors.education} helperText={errors.education?.message} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Institution" placeholder="IIT Delhi" {...register("institution")} error={!!errors.institution} helperText={errors.institution?.message} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Graduation Year" type="number"
                        {...register("graduation_year", { valueAsNumber: true })}
                        error={!!errors.graduation_year} helperText={errors.graduation_year?.message} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select fullWidth label="Experience Level" {...register("experience_level")} defaultValue="fresher">
                          {["fresher", "1-2 years", "3+ years"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                        </TextField>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}

                {/* Step 1: Skills */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>💡 Select your current skills</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
                      Select all skills you know — even basic ones. ({selectedSkills.length} selected)
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 320, overflowY: "auto", pr: 1 }}>
                      {ALL_SKILLS.map((skill) => (
                        <Chip
                          key={skill} label={skill} clickable onClick={() => toggleSkill(skill)}
                          sx={{
                            background: selectedSkills.includes(skill) ? alpha(brand.blue, 0.2) : "transparent",
                            border: `1px solid ${selectedSkills.includes(skill) ? brand.blue : alpha("#fff", 0.15)}`,
                            color: selectedSkills.includes(skill) ? brand.blue : "text.secondary",
                            fontWeight: selectedSkills.includes(skill) ? 700 : 400,
                            transition: "all 0.2s",
                          }}
                        />
                      ))}
                    </Box>
                  </motion.div>
                )}

                {/* Step 2: Goals */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>🎯 Career goals & preferences</Typography>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12 }}><TextField fullWidth label="Dream Role" placeholder="Backend Developer at a startup" {...register("dream_role")} error={!!errors.dream_role} helperText={errors.dream_role?.message} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select fullWidth label="Preferred Domain" {...register("preferred_domain")} defaultValue="">
                          {["Backend", "Frontend", "Full Stack", "Data Science", "AI/ML", "DevOps", "Cloud", "Mobile", "Cybersecurity", "QA"].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Preferred Location" placeholder="Bangalore / Remote" {...register("preferred_location")} error={!!errors.preferred_location} helperText={errors.preferred_location?.message} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select fullWidth label="Coding or Non-Coding?" {...register("coding_preference")} defaultValue="coding">
                          {["coding", "non-coding", "both"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField select fullWidth label="Startup or MNC?" {...register("company_preference")} defaultValue="both">
                          {["startup", "mnc", "both"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                        </TextField>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button variant="outlined" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
                {step < STEPS.length - 1 ? (
                  <Button variant="contained" onClick={nextStep}>Continue →</Button>
                ) : (
                  <Button type="submit" variant="contained" disabled={loading} sx={{ px: 4 }}>
                    {loading ? "Creating Profile..." : "Complete Setup 🚀"}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
