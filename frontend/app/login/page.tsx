"use client";
import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  InputAdornment, IconButton, Alert, LinearProgress,
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
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.login(data);
      setAuth(res.user, res.access_token, res.refresh_token);
      toast.success(`Welcome back, ${res.user.name}! 👋`);
      if (!res.user.onboarding_complete) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2, position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: brand.blue, filter: "blur(120px)", opacity: 0.1 }} />
      <Box sx={{ position: "absolute", bottom: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: brand.purple, filter: "blur(100px)", opacity: 0.1 }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 440 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4, justifyContent: "center", cursor: "pointer" }} onClick={() => router.push("/")}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AutoAwesomeIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>SkillBridge AI</Typography>
        </Box>

        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Welcome back</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>Sign in to continue your career journey.</Typography>

            {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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

              <Box sx={{ textAlign: "right", mt: -1 }}>
                <Typography variant="caption" sx={{ color: brand.blue, cursor: "pointer" }}>Forgot password?</Typography>
              </Box>

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5 }}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                Don&apos;t have an account?{" "}
                <Box component="span" sx={{ color: brand.blue, cursor: "pointer", fontWeight: 600 }} onClick={() => router.push("/signup")}>
                  Sign up free
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
