import {
  mockUser,
  mockReports,
  mockActivityTimeline,
  mockNotifications,
  mockDashboardStats,
  type User,
  type Report,
  type ActivityEvent,
  type Notification,
  type DashboardStats,
} from '@/data/mock-dashboard';

/*
 * Dashboard service layer.
 *
 * This module is the ONLY place the dashboard page talks to for data. It hides
 * whether the data comes from a local mock (initial UI development) or from the
 * real backend API.
 *
 * ── IMPORTANT ────────────────────────────────────────────────────────────────
 *  • Mock data lives in `data/mock-dashboard.ts` and is used ONLY here while the
 *    UI is being built. Do not import mock data anywhere else.
 *  • Real API calls belong in `services/` (see `services/api.ts` for the shared
 *    axios instance). Flip `USE_MOCK_DATA` to `false` and wire the endpoints in
 *    `fetchDashboardData` once the backend is ready.
 * ────────────────────────────────────────────────────────────────────────────
 */

const USE_MOCK_DATA = true;

/** Shape consumed by the citizen dashboard page. */
export interface DashboardData {
  user: User;
  stats: DashboardStats;
  reports: Report[];
  activities: ActivityEvent[];
  notifications: Notification[];
}

/** Simulated latency so loading skeletons are observable during UI development. */
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Load everything the citizen dashboard needs in one call.
 * Replace the mock branch with parallel API requests when the backend is ready.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return {
      user: mockUser,
      stats: mockDashboardStats,
      reports: mockReports,
      activities: mockActivityTimeline,
      notifications: mockNotifications,
    };
  }

  // Real API integration (uncomment + adapt once endpoints exist):
  //
  // const [user, stats, reports, activities, notifications] = await Promise.all([
  //   getUserProfile(),          // GET  /users/me
  //   getDashboardStats(),       // GET  /reports/stats
  //   getMyReports(),            // GET  /reports?mine=true
  //   getActivityTimeline(),     // GET  /activity
  //   getNotifications(),        // GET  /notifications
  // ]);
  // return { user, stats, reports, activities, notifications };

  throw new Error('Real API for the citizen dashboard is not implemented yet.');
}

/**
 * Fetch a single report by its id for the report details page.
 * Mock branch looks the report up in `mockReports` and rejects when not found;
 * the real branch will call `GET /reports/:id`.
 */
export async function fetchReportById(id: string): Promise<Report> {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    const report = mockReports.find((r) => r.id === id);
    if (!report) {
      throw new Error(`Report "${id}" not found.`);
    }
    return report;
  }

  // Real API integration (uncomment + adapt once endpoint exists):
  //
  // const response = await api.get(`/reports/${id}`);
  // const data = response.data?.data?.report ?? response.data?.data;
  // return data as Report;

  throw new Error('Real API for a single report is not implemented yet.');
}