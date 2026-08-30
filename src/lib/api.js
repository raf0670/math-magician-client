const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const BACKEND_ROOT_URL = API_BASE_URL.replace(/\/api$/, "");

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;

  if (base.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${base}${normalizedPath.slice(4)}`;
  }

  return `${base}${normalizedPath}`;
}

function buildQueryPath(path, query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false || value === "") return;
    params.set(key, value === true ? "true" : value.toString());
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function createClientAttemptId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildSubmissionBody(answers, metadata = {}) {
  const body = { answers };
  if (metadata?.submissionReason) body.submissionReason = metadata.submissionReason;
  if (metadata?.isRetake) {
    body.isRetake = true;
    body.clientAttemptId = metadata.clientAttemptId || createClientAttemptId();
  }

  return body;
}

function emitAuthStateChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-state-changed"));
  }
}

export async function warmBackend() {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), 4000)
    : null;

  try {
    await fetch(BACKEND_ROOT_URL, {
      method: "GET",
      cache: "no-store",
      signal: controller?.signal,
    });
  } catch {
    // Warm-up failures should never affect the landing page.
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
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

      throw new ApiError(data.message || "Request failed", response.status, data);
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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryRequest(error) {
  return !error?.status || error.status >= 500;
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

export function savePendingProgramAction(action = "enroll") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("exam_archive_pending_program_action", action);
}

export function getPendingProgramAction() {
  if (typeof window === "undefined") return "enroll";
  return window.localStorage.getItem("exam_archive_pending_program_action") || "enroll";
}

export function clearPendingProgramAction() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("exam_archive_pending_program_action");
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

export async function requestPasswordReset(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(token, password) {
  return request(`/api/auth/reset-password/${encodeURIComponent(token)}`, {
    method: "PUT",
    body: { password },
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

export async function submitManualEnrollment(planId, formData, paymentChoice, paymentMethod = "bkash") {
  return request("/api/payments/manual-enrollment", {
    method: "POST",
    body: { planId, formData, paymentChoice, paymentMethod },
  });
}

export async function getPaymentAccess() {
  return request("/api/payments/my-access");
}

export async function submitSeatBooking(planId, formData) {
  return request("/api/payments/book-seat", {
    method: "POST",
    body: { planId, formData },
  });
}

export async function getMyBooking() {
  return request("/api/payments/my-booking");
}

export async function submitBookedCheckout(payload) {
  return request("/api/payments/booked-checkout", {
    method: "POST",
    body: payload,
  });
}

export async function getAdminEnrollmentReviews(status = "") {
  const suffix = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/payments/admin/enrollments${suffix}`);
}

export async function getAdminPreBookings() {
  return request("/api/payments/admin/pre-bookings");
}

export async function updateAdminEnrollmentStatus(paymentId, status, reviewNote = "") {
  return request(`/api/payments/admin/enrollments/${paymentId}/status`, {
    method: "PATCH",
    body: { status, reviewNote },
  });
}

export async function markAdminEnrollmentFullyPaid(paymentId, finalTrxID) {
  return request(`/api/payments/admin/enrollments/${paymentId}/final-payment`, {
    method: "PATCH",
    body: { finalTrxID },
  });
}

export async function getCurrentLiveClass() {
  return request("/api/classes/current");
}

export async function getAdminLiveClasses() {
  return request("/api/classes/admin");
}

export async function createAdminLiveClass(payload) {
  return request("/api/classes/admin", {
    method: "POST",
    body: payload,
  });
}

export async function updateAdminLiveClass(classId, payload) {
  return request(`/api/classes/admin/${classId}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getExams() {
  return request("/api/exams");
}

export async function getLiveExams() {
  return request("/api/exams/live");
}

export async function getAssignments() {
  return request("/api/exams/assignments");
}

export async function getAdminLiveExams() {
  return request("/api/exams/live/admin");
}

export async function getAdminLiveExamPreview(examId) {
  return request(`/api/exams/live/admin/${examId}/preview`);
}

export async function getAdminAssignments() {
  return request("/api/exams/assignments/admin");
}

export async function createAdminLiveExam(payload) {
  return request("/api/exams/live/admin", {
    method: "POST",
    body: payload,
  });
}

export async function createAdminAssignment(payload) {
  return request("/api/exams/assignments/admin", {
    method: "POST",
    body: payload,
  });
}

export async function updateAdminLiveExam(examId, payload) {
  return request(`/api/exams/live/admin/${examId}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function updateAdminAssignment(examId, payload) {
  return request(`/api/exams/assignments/admin/${examId}`, {
    method: "PATCH",
    body: payload,
  });
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

export async function startQuizExam(payload) {
  return request("/api/exams/quiz/start", {
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

export async function getExamLeaderboard(examId) {
  return request(`/api/analytics/leaderboard/${examId}`);
}

export async function getCompetitionSummary() {
  return request("/api/analytics/competition");
}

export async function getAdminLiveExamSubmissions(examId) {
  return request(`/api/analytics/admin/live-exams/${examId}/submissions`);
}

export async function getAdminAssignmentSubmissions(examId) {
  return request(`/api/analytics/admin/assignments/${examId}/submissions`);
}

export async function getAssessmentTest() {
  return request("/api/assessment-test");
}

export async function getAssessmentTestExam(metadata = {}) {
  return request(buildQueryPath("/api/assessment-test/exam", { retake: metadata?.isRetake }));
}

export async function submitAssessmentTest(answers, metadata = {}) {
  const maxAttempts = 3;
  const body = buildSubmissionBody(answers, {
    ...metadata,
    clientAttemptId: metadata?.isRetake ? metadata.clientAttemptId || createClientAttemptId() : metadata?.clientAttemptId,
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await request("/api/assessment-test/submit", {
        method: "POST",
        body,
      });
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetryRequest(error)) {
        throw error;
      }

      await wait(500 * attempt);
    }
  }
}

export async function updateSubmissionModeration(submissionId, payload) {
  return request(`/api/analytics/admin/submissions/${submissionId}/moderation`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getExamById(examId, metadata = {}) {
  return request(buildQueryPath(`/api/exams/${examId}`, { retake: metadata?.isRetake }));
}

export async function submitExam(examId, answers, metadata = {}) {
  const maxAttempts = 3;
  const body = buildSubmissionBody(answers, {
    ...metadata,
    clientAttemptId: metadata?.isRetake ? metadata.clientAttemptId || createClientAttemptId() : metadata?.clientAttemptId,
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await request(`/api/exams/${examId}/submit`, {
        method: "POST",
        body,
      });
    } catch (error) {
      if (attempt === maxAttempts || !shouldRetryRequest(error)) {
        throw error;
      }

      await wait(500 * attempt);
    }
  }
}
