"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box, Typography, TextField, IconButton, Card, CardContent,
  Avatar, Chip, CircularProgress, alpha, Button,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import { mentorService } from "@/services/services";
import { useAuthStore } from "@/store/auth.store";
import { brand } from "@/theme/theme";

const STARTER_QUESTIONS = [
  "How do I prepare for a Backend Developer interview?",
  "What's the best way to learn system design?",
  "Can you review my skill gaps for a Data Scientist role?",
  "How long will it take me to be job-ready?",
];

export default function MentorPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: mentorService.getHistory,
  });

  useEffect(() => {
    if (history) setLocalMessages(history);
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const sendMutation = useMutation({
    mutationFn: (msg: string) => mentorService.chat(msg),
    onMutate: (msg) => {
      const userMsg = { role: "user", content: msg, id: Date.now() };
      setLocalMessages((prev) => [...prev, userMsg]);
    },
    onSuccess: (data: { reply: string; model_used: string; session_id: string }) => {
      const aiMsg = { role: "assistant", content: data.reply, model_used: data.model_used, id: Date.now() + 1 };
      setLocalMessages((prev) => [...prev, aiMsg]);
    },
    onError: () => toast.error("Failed to get response. Please try again."),
    onSettled: () => setSending(false),
  });

  const handleSend = () => {
    if (!message.trim() || sending) return;
    setSending(true);
    const msg = message.trim();
    setMessage("");
    sendMutation.mutate(msg);
  };

  const handleClear = async () => {
    await mentorService.clearHistory();
    setLocalMessages([]);
    toast.success("Chat history cleared.");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", gap: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>AI Career Mentor</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label="Gemini 2.5 Flash" size="small" color="primary" sx={{ fontSize: "0.7rem" }} />
            <Chip label="Groq Fallback" size="small" sx={{ fontSize: "0.7rem" }} />
          </Box>
        </Box>
        <Button variant="outlined" size="small" startIcon={<DeleteSweepIcon />} onClick={handleClear} color="error">
          Clear
        </Button>
      </Box>

      {/* Chat messages */}
      <Card sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Welcome */}
          {localMessages.length === 0 && !isLoading && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                <SmartToyIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Hi {user?.name?.split(" ")[0]}! I&apos;m your AI Career Mentor 👋</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, maxWidth: 400, mx: "auto" }}>
                Ask me anything about career planning, skill development, interviews, or job searching.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                {STARTER_QUESTIONS.map((q) => (
                  <Chip key={q} label={q} onClick={() => setMessage(q)} clickable
                    sx={{ background: alpha(brand.blue, 0.1), border: `1px solid ${alpha(brand.blue, 0.25)}`, fontSize: "0.78rem", cursor: "pointer" }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Messages */}
          <AnimatePresence>
            {localMessages.map((msg: any, i: number) => (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: "flex", gap: 1.5, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                  <Avatar sx={{
                    width: 32, height: 32, flexShrink: 0, fontSize: "0.8rem",
                    background: msg.role === "user" ? `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})` : `linear-gradient(135deg, ${brand.purple}, ${brand.pink})`,
                  }}>
                    {msg.role === "user" ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Box
                    sx={{
                      maxWidth: "75%",
                      p: 2, borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      background: msg.role === "user" ? `linear-gradient(135deg, ${alpha(brand.blue, 0.25)}, ${alpha(brand.blue, 0.15)})` : alpha("#fff", 0.05),
                      border: `1px solid ${alpha("#fff", 0.08)}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.content}</Typography>
                    {msg.model_used && (
                      <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                        via {msg.model_used}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {sending && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg, ${brand.purple}, ${brand.pink})` }}>
                <SmartToyIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box sx={{ p: 2, borderRadius: "4px 16px 16px 16px", background: alpha("#fff", 0.05), display: "flex", gap: 0.5, alignItems: "center" }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <Box key={i} sx={{ width: 6, height: 6, borderRadius: "50%", background: brand.blue, animation: "bounce 1s ease infinite", animationDelay: `${delay}s`, "@keyframes bounce": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } } }} />
                ))}
              </Box>
            </Box>
          )}

          <div ref={bottomRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: `1px solid ${alpha("#fff", 0.08)}`, display: "flex", gap: 1.5 }}>
          <TextField
            fullWidth multiline maxRows={4}
            placeholder="Ask your AI mentor anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() || sending}
            sx={{ background: `linear-gradient(135deg, ${brand.blue}, ${brand.cyan})`, color: "#fff", width: 48, height: 48, borderRadius: 3, "&:disabled": { opacity: 0.4 }, "&:hover": { opacity: 0.85 } }}
          >
            {sending ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
