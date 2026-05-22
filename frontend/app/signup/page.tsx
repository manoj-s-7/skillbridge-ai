"use client";
import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  MenuItem, InputAdornment, IconButton, Alert, LinearProgress, alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { brand } from "@/theme/theme";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "graduate", "jobseeker", "recruiter"]),
});
type FormData = z.infer<typeof schema>;

const roles = [
  { value: "student", label: "🎓 Student" },
  { value: "graduate", label: "🏫 Graduate" },
  { value: "jobseeker", label: "💼 Job Seeker" },
  { value: "recruiter", label: "🔍 Recruiter" },
];

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.register(data);
      setAuth(res.user, res.access_token, res.refresh_token);
      toast.success(`Welcome to SkillBridge AI, ${res.user.name}! 🎉`);
      router.push("/onboarding");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        p: 2, position: "relative", overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <Box sx={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: brand.blue, filter: "blur(120px)", opacity: 0.1 }} />
      <Box sx={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: brand.cyan, filter: "blur(100px)", opacity: 0.1 }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 460 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4, justifyContent: "center", cursor: "pointer" }} onClick={() => router.push("/")}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AutoAwesomeIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>SkillBridge AI</Typography>
        </Box>

        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Create your account</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              Start your AI-powered career journey today.
            </Typography>

            {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField label="Full Name" fullWidth {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
              <TextField label="Email Address" type="email" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              <TextField
                label="Password" type={showPassword ? "text" : "password"} fullWidth
                {...register("password")} error={!!errors.password} helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField label="I am a..." select fullWidth {...register("role")} error={!!errors.role} helperText={errors.role?.message} defaultValue="student">
                {roles.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </TextField>

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5, mt: 0.5 }}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                Already have an account?{" "}
                <Box component="span" sx={{ color: brand.blue, cursor: "pointer", fontWeight: 600 }} onClick={() => router.push("/login")}>
                  Sign in
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
