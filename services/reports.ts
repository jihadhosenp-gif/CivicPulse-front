import { api } from './api';
import type {
  CreatedReport,
  GeoPoint,
  ReportSubmission,
} from '@/types/report';

/*
 * Report service layer.
 *
 * The ONLY place the report submission UI talks to for network calls. It hides
 * whether data goes to the real backend or a mock, mirroring the pattern used by
 * `services/dashboard.ts`.
 *
 * ── Backend contract (API_SPECIFICATION.md §5.1) ─────────────────────────────
 *   POST /reports   (multipart/form-data)
 *     title: string
 *     description: string
 *     category: string (ObjectId)
 *     location: JSON string { type: "Point", coordinates: [lng, lat] }
 *     address: string
 *     images: File[] (max 5, 5MB each)
 * ────────────────────────────────────────────────────────────────────────────
 */

const USE_MOCK_DATA = false;

export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB, matches backend limit
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface SubmitReportOptions {
  /**
   * Called with overall + per-image upload progress (0-100).
   * Backed by axios `onUploadProgress` when the real API is used.
   */
  onProgress?: (percent: number) => void;
  /** AbortSignal so a submit can be cancelled (e.g. unmount). */
  signal?: AbortSignal;
}

export interface SubmitReportResult {
  report: CreatedReport;
}

/** Simulated latency for the mock branch so loading/progress states are observable. */
const mockDelay = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Map the UI category slug to whatever the backend expects.
 * The spec uses category ObjectIds; while the backend catalog is not wired we
 * send the slug. Swap this for a slug->ObjectId lookup when categories load.
 */
function mapCategorySlugToValue(slug: string): string {
  return slug;
}

/**
 * Build the multipart body exactly as the API expects.
 */
export function buildReportFormData(payload: ReportSubmission): FormData {
  const form = new FormData();

  form.append('title', payload.title.trim());
  form.append('description', payload.description.trim());
  form.append('category', mapCategorySlugToValue(payload.category));

  if (payload.point) {
    const location: GeoPoint = payload.point;
    // Backend expects a JSON string for `location` in multipart mode.
    form.append('location', JSON.stringify(location));
  }

  if (payload.location.trim()) {
    form.append('address', payload.location.trim());
  }

  payload.images.forEach((image) => {
    // Each image must be appended as its own `images` field.
    form.append('images', image.file, image.file.name);
  });

  return form;
}

/**
 * Submit a new report.
 *
 * Real branch: POST /reports with progress reporting.
 * Mock branch: resolve after a simulated delay so the UI can be built without a backend.
 */
export async function submitReport(
  payload: ReportSubmission,
  options: SubmitReportOptions = {}
): Promise<SubmitReportResult> {
  const { onProgress, signal } = options;

  if (USE_MOCK_DATA) {
    await mockDelay();
    onProgress?.(100);
    return {
      report: {
        id: `RPT-${Date.now()}`,
        title: payload.title.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    };
  }

  const form = buildReportFormData(payload);

  const response = await api.post('/reports', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal,
    onUploadProgress: (event) => {
      if (!onProgress) return;
      if (!event.total) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    },
  });

  // API envelope: { success: true, data: { report: {...} } }
  const report = response.data?.data?.report ?? response.data?.data;

  return {
    report: {
      id: report.id ?? report._id ?? '',
      title: report.title,
      status: report.status ?? 'pending',
      createdAt: report.createdAt ?? new Date().toISOString(),
    },
  };
}

/**
 * Normalise an axios/unknown error into the standard API error envelope shape
 * so the form can render field-level + form-level messages consistently.
 */
export interface NormalizedReportError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function normalizeReportError(error: unknown): NormalizedReportError {
  const fallback: NormalizedReportError = {
    message: 'Something went wrong while submitting your report. Please try again.',
    fieldErrors: {},
  };

  const err = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Array<{ field?: string; message: string }> | Record<string, string | string[]>;
      };
    };
    message?: string;
  };

  const data = err.response?.data;

  if (!data) {
    // Network / CORS / timeout.
    if (err.message === 'Network Error') {
      return { message: 'Cannot reach the server. Check your connection and try again.', fieldErrors: {} };
    }
    return fallback;
  }

  const fieldErrors: Record<string, string> = {};
  if (Array.isArray(data.errors)) {
    data.errors.forEach((item) => {
      if (item.field) fieldErrors[item.field] = item.message;
    });
  } else if (data.errors && typeof data.errors === 'object') {
    Object.entries(data.errors).forEach(([key, value]) => {
      fieldErrors[key] = Array.isArray(value) ? value[0] : value;
    });
  }

  return {
    message: data.message || fallback.message,
    fieldErrors,
  };
}