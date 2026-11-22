/**
 * Report submission domain types.
 *
 * These mirror the create-report contract in `API_SPECIFICATION.md` (§5.1) and
 * the category list in §4. They intentionally live in `types/` so both the
 * submit UI and the service layer can share them without importing UI code.
 */

/** Canonical category slugs. Order matches the product spec / UI. */
export type ReportCategorySlug =
  | 'road-damage'
  | 'garbage'
  | 'waterlogging'
  | 'streetlight'
  | 'water-supply'
  | 'public-safety'
  | 'other';

export interface ReportCategoryOption {
  slug: ReportCategorySlug;
  /** Human label shown in the UI (matches API default category names). */
  label: string;
  /** One-line helper text shown under the option. */
  hint: string;
}

export const REPORT_CATEGORIES: ReportCategoryOption[] = [
  { slug: 'road-damage', label: 'Road Damage', hint: 'Potholes, cracked roads, broken footpaths' },
  { slug: 'garbage', label: 'Garbage', hint: 'Overflowing bins, illegal dumping, littering' },
  { slug: 'waterlogging', label: 'Waterlogging', hint: 'Street flooding, drainage overflow' },
  { slug: 'streetlight', label: 'Streetlight', hint: 'Broken, flickering or missing street lights' },
  { slug: 'water-supply', label: 'Water Supply', hint: 'Low pressure, outages, contaminated water' },
  { slug: 'public-safety', label: 'Public Safety', hint: 'Hazards, unsafe structures, security issues' },
  { slug: 'other', label: 'Other', hint: 'Anything that does not fit the categories above' },
];

/** GeoJSON Point as accepted by the backend `location` field. */
export interface GeoPoint {
  type: 'Point';
  /** [longitude, latitude] — note the lng-first ordering. */
  coordinates: [number, number];
}

/** A locally selected image, before it is uploaded to the backend. */
export interface SelectedImage {
  /** Client-side unique id used for keys and removal. */
  id: string;
  /** The underlying browser File. */
  file: File;
  /** Object URL used for the preview thumbnail. */
  previewUrl: string;
  /** Upload progress in percent (0-100). Undefined before upload starts. */
  progress?: number;
}

/**
 * Payload assembled by the form and handed to the service layer.
 * `category` is the category slug; the service maps it to an ObjectId if needed.
 */
export interface ReportSubmission {
  title: string;
  description: string;
  category: ReportCategorySlug;
  /** Optional free-text address / landmark for the pinned location. */
  location: string;
  /** Selected point, or null when the user has not placed a pin yet. */
  point: GeoPoint | null;
  images: SelectedImage[];
}

/** Shape returned by `POST /reports` (subset the UI cares about). */
export interface CreatedReport {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

/** Error shape aligned with the shared API envelope (API_SPECIFICATION.md §9). */
export interface ReportFieldErrors {
  [field: string]: string | undefined;
}