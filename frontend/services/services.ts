/** All remaining API service wrappers */
import api from "./api";

// ── Resume ──────────────────────────────────────────────────────────────────
export const resumeService = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/resume/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },
  getAnalysis: () => api.get("/resume/analysis").then((r) => r.data),
  deleteResume: () => api.delete("/resume"),
};

// ── Onboarding ───────────────────────────────────────────────────────────────
export const onboardingService = {
  submit: (data: object) => api.post("/onboarding", data).then((r) => r.data),
  getStatus: () => api.get("/onboarding/status").then((r) => r.data),
  getProfile: () => api.get("/onboarding/profile").then((r) => r.data),
};

// ── Certifications ───────────────────────────────────────────────────────────
export const certService = {
  submit: (certifications: string[], target_role: string) =>
    api.post("/certifications", { certifications, target_role }).then((r) => r.data),
  get: () => api.get("/certifications").then((r) => r.data),
};

// ── Skill Analysis ───────────────────────────────────────────────────────────
export const skillService = {
  analyze: (target_role: string, current_skills?: string[]) =>
    api.post("/skill-analysis", { target_role, current_skills }).then((r) => r.data),
  getLatest: () => api.get("/skill-analysis/latest").then((r) => r.data),
  generateProjects: (target_role: string) =>
    api.post(`/skill-analysis/projects?target_role=${encodeURIComponent(target_role)}`).then((r) => r.data),
};

// ── Roadmap ──────────────────────────────────────────────────────────────────
export const roadmapService = {
  generate: (target_role: string, duration_weeks: number = 12) =>
    api.post("/roadmap/generate", { target_role, duration_weeks }).then((r) => r.data),
  get: () => api.get("/roadmap").then((r) => r.data),
};

// ── Jobs ─────────────────────────────────────────────────────────────────────
export const jobService = {
  getRecommended: (limit = 10) => api.get(`/jobs/recommend?limit=${limit}`).then((r) => r.data),
  getAll: (page = 1, limit = 20) => api.get(`/jobs?page=${page}&limit=${limit}`).then((r) => r.data),
};

// ── Internships ───────────────────────────────────────────────────────────────
export const internshipService = {
  getRecommended: (limit = 10) => api.get(`/internships/recommend?limit=${limit}`).then((r) => r.data),
  getAll: (page = 1, limit = 20) => api.get(`/internships?page=${page}&limit=${limit}`).then((r) => r.data),
};

// ── Interview ─────────────────────────────────────────────────────────────────
export const interviewService = {
  generate: (target_role: string, question_types: string[], num_questions: number) =>
    api.post("/interview/generate", { target_role, question_types, num_questions }).then((r) => r.data),
  getHistory: () => api.get("/interview/history").then((r) => r.data),
};

// ── Mentor ────────────────────────────────────────────────────────────────────
export const mentorService = {
  chat: (message: string, context_window = 10) =>
    api.post("/mentor/chat", { message, context_window }).then((r) => r.data),
  getHistory: () => api.get("/mentor/history").then((r) => r.data),
  clearHistory: () => api.delete("/mentor/history"),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardService = {
  getMetrics: () => api.get("/dashboard/metrics").then((r) => r.data),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminService = {
  getUsers: (page = 1, limit = 20) => api.get(`/admin/users?page=${page}&limit=${limit}`).then((r) => r.data),
  updateUser: (id: string, data: object) => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  getStats: () => api.get("/admin/stats").then((r) => r.data),
};
