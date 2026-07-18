const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;

  if (base.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${base}${normalizedPath.slice(4)}`;
  }

  return `${base}${normalizedPath}`;
}

function emitAuthStateChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-state-changed"));
  }
}

async function request(path, options = {}) {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("exam_archive_token") : null;

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), 10000)
    : null;

  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      signal: controller?.signal,
      headers,
      body: options.body
        ? typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthSession();
      }

      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }

    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function saveAuthSession(token, user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("exam_archive_token", token);
  window.localStorage.setItem("exam_archive_user", JSON.stringify(user));
  emitAuthStateChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exam_archive_token");
  window.localStorage.removeItem("exam_archive_user");
  emitAuthStateChange();
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("exam_archive_user");
  return raw ? JSON.parse(raw) : null;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("exam_archive_token");
}

export function savePendingPaymentPlan(planId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("exam_archive_pending_plan", planId);
}

export function getPendingPaymentPlan() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("exam_archive_pending_plan");
}

export function clearPendingPaymentPlan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exam_archive_pending_plan");
}

export function savePendingEnrollment(payload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("exam_archive_pending_enrollment", JSON.stringify(payload));
}

export function getPendingEnrollment() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("exam_archive_pending_enrollment");
  return raw ? JSON.parse(raw) : null;
}

export function clearPendingEnrollment() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exam_archive_pending_enrollment");
}

export async function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getProfile() {
  return request("/api/auth/me");
}

export async function updateProfile(payload) {
  return request("/api/auth/profile", {
    method: "PUT",
    body: payload,
  });
}

export async function changePassword(payload) {
  return request("/api/auth/change-password", {
    method: "PUT",
    body: payload,
  });
}

export async function getCourses() {
  return request("/api/courses");
}

export async function submitManualEnrollment(planId, formData) {
  return request("/api/payments/manual-enrollment", {
    method: "POST",
    body: { planId, formData },
  });
}

export async function getPaymentAccess() {
  return request("/api/payments/my-access");
}

export async function getAdminEnrollmentReviews(status = "") {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/payments/admin/enrollments${suffix}`);
}

export async function updateAdminEnrollmentStatus(paymentId, status, reviewNote = "") {
  return request(`/api/payments/admin/enrollments/${paymentId}/status`, {
    method: "PATCH",
    body: { status, reviewNote },
  });
}

export async function getExams() {
  return request("/api/exams");
}

export async function getPracticeMeta() {
  return request("/api/exams/practice/meta");
}

export async function startPracticeExam(payload) {
  return request("/api/exams/practice/start", {
    method: "POST",
    body: payload,
  });
}

export async function getMyStats() {
  return request("/api/analytics/my-stats");
}

export async function getLeaderboard() {
  return request("/api/analytics/leaderboard");
}

export async function getExamById(examId) {
  return request(`/api/exams/${examId}`);
}

export async function submitExam(examId, answers) {
  return request(`/api/exams/${examId}/submit`, {
    method: "POST",
    body: { answers },
  });
}
