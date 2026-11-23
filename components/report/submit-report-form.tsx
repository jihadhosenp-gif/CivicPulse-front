'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Tag,
  MapPin,
  ImageIcon,
  Send,
  Loader2,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Construction,
  Trash2,
  Waves,
  Lightbulb,
  Droplet,
  ShieldAlert,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Field } from '@/components/report/field';
import { ImageUpload } from '@/components/report/image-upload';
import { MapPicker } from '@/components/report/map-picker';
import {
  submitReport,
  normalizeReportError,
} from '@/services/reports';
import {
  REPORT_CATEGORIES,
  type ReportCategorySlug,
  type SelectedImage,
} from '@/types/report';

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;
const DESCRIPTION_MIN = 20;

interface FormState {
  title: string;
  description: string;
  category: ReportCategorySlug | '';
  address: string;
  point: { type: 'Point'; coordinates: [number, number] } | null;
  images: SelectedImage[];
}

const initialState: FormState = {
  title: '',
  description: '',
  category: '',
  address: '',
  point: null,
  images: [],
};

type FieldErrors = Partial<
  Record<'title' | 'description' | 'category' | 'point' | 'images' | 'form', string>
>;

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Issue title is required.';
  } else if (values.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  } else if (values.title.trim().length > TITLE_MAX) {
    errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  } else if (values.description.trim().length < DESCRIPTION_MIN) {
    errors.description = `Please add a little more detail (at least ${DESCRIPTION_MIN} characters).`;
  } else if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
  }

  if (!values.category) {
    errors.category = 'Please select a category.';
  }

  if (!values.point) {
    errors.point = 'Please pin the issue location on the map or enter coordinates.';
  }

  return errors;
}

/** Icon per category, used to enrich the category selection UI. */
const CATEGORY_ICONS: Record<ReportCategorySlug, LucideIcon> = {
  'road-damage': Construction,
  garbage: Trash2,
  waterlogging: Waves,
  streetlight: Lightbulb,
  'water-supply': Droplet,
  'public-safety': ShieldAlert,
  other: MoreHorizontal,
};

/** Section entrance animation. */
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/** Shared input styling so invalid controls read consistently. */
function controlInvalidClass(hasError: boolean) {
  return hasError ? 'border-danger focus-visible:ring-danger' : '';
}

export function SubmitReportForm() {
  const router = useRouter();
  const [values, setValues] = React.useState<FormState>(initialState);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  // Keep a ref of the latest values so validate can be called from callbacks.
  const valuesRef = React.useRef(values);
  valuesRef.current = values;

  const setField = React.useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        // Re-validate the touched field live once it has been touched.
        if (touched[key]) {
          const nextErrors = validate(next);
          setErrors((prevErrors) => ({ ...prevErrors, [key]: nextErrors[key as keyof FieldErrors] }));
        }
        return next;
      });
    },
    [touched]
  );

  const handleBlur = React.useCallback((key: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const nextErrors = validate(valuesRef.current);
    setErrors((prev) => ({ ...prev, [key]: nextErrors[key as keyof FieldErrors] }));
  }, []);

  const handleImageError = React.useCallback((message: string) => {
    toast({ title: 'Image not added', description: message, variant: 'warning' });
  }, []);

  const resetForm = React.useCallback(() => {
    values.images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setValues(initialState);
    setErrors({});
    setTouched({});
    setUploadProgress(null);
  }, [values.images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while a request is in flight.
    if (isSubmitting) return;

    const nextErrors = validate(values);
    // Mark everything touched so errors show.
    setTouched({ title: true, description: true, category: true, point: true });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        title: 'Please fix the highlighted fields',
        description: 'A few required details are missing or invalid.',
        variant: 'warning',
      });
      // Scroll to the first error.
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setErrors({});

    abortRef.current = new AbortController();

    try {
      await submitReport(
        {
          title: values.title,
          description: values.description,
          category: values.category as ReportCategorySlug,
          location: values.address,
          point: values.point,
          images: values.images,
        },
        {
          signal: abortRef.current.signal,
          onProgress: (percent) => setUploadProgress(percent),
        }
      );

      setIsSuccess(true);
      toast({
        title: 'Report submitted',
        description: 'Thanks! Your report has been sent for review.',
        variant: 'success',
      });
    } catch (error: unknown) {
      const normalized = normalizeReportError(error);

      // Map service field errors onto local field keys where names overlap.
      const mapped: FieldErrors = { form: normalized.message };
      (['title', 'description', 'category'] as const).forEach((key) => {
        if (normalized.fieldErrors[key]) mapped[key] = normalized.fieldErrors[key];
      });
      if (normalized.fieldErrors.point || normalized.fieldErrors.location) {
        mapped.point = normalized.fieldErrors.point ?? normalized.fieldErrors.location;
      }

      setErrors(mapped);
      setTouched({ title: true, description: true, category: true, point: true });

      if (!Object.keys(normalized.fieldErrors).length) {
        toast({
          title: 'Submission failed',
          description: normalized.message,
          variant: 'danger',
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
      abortRef.current = null;
    }
  };

  // Cancel any in-flight upload on unmount.
  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (isSuccess) {
    return <SuccessState onReset={resetForm} onViewReports={() => router.push('/reports')} />;
  }

  const descriptionLength = values.description.length;

  // Completion state for the required sections, powering the progress indicator.
  const sectionStatus = {
    details: values.title.trim().length >= 5 && values.description.trim().length >= DESCRIPTION_MIN,
    category: !!values.category,
    location: !!values.point,
  };
  const completedCount = Object.values(sectionStatus).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
      {/* Form-level error banner */}
      {errors.form && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-start gap-3 rounded-[14px] border border-danger/25 bg-danger/5 p-4 text-danger shadow-elegant"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">We couldn&apos;t submit your report</p>
            <p className="mt-0.5 text-danger/90">{errors.form}</p>
          </div>
        </motion.div>
      )}

      {/* Progress indicator */}
      <FormProgress completedCount={completedCount} status={sectionStatus} />

      {/* Section 1 — Issue details */}
      <SectionCard
        custom={0}
        step={1}
        icon={<FileText className="h-5 w-5" />}
        title="Issue details"
        description="Give your report a clear title and a helpful description."
        complete={sectionStatus.details}
      >
        <div className="mt-5 space-y-5">
          <Field
            id="field-title"
            label="Issue title"
            required
            error={touched.title ? errors.title : undefined}
            aside={
              <span
                className={cn(
                  'text-xs tabular-nums',
                  values.title.length > TITLE_MAX ? 'text-danger' : 'text-muted-foreground'
                )}
              >
                {values.title.length}/{TITLE_MAX}
              </span>
            }
          >
            <Input
              id="title"
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="e.g. Large pothole on Banani Road 11"
              maxLength={TITLE_MAX + 20}
              aria-invalid={touched.title && !!errors.title}
              disabled={isSubmitting}
              className={controlInvalidClass(touched.title && !!errors.title)}
            />
          </Field>

          <Field
            id="field-description"
            label="Description"
            required
            error={touched.description ? errors.description : undefined}
            hint={`Minimum ${DESCRIPTION_MIN} characters. Be specific about what, where and how severe.`}
            aside={
              <span
                className={cn(
                  'text-xs tabular-nums',
                  descriptionLength > DESCRIPTION_MAX ? 'text-danger' : 'text-muted-foreground'
                )}
              >
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            }
          >
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Describe the issue in detail…"
              rows={5}
              aria-invalid={touched.description && !!errors.description}
              disabled={isSubmitting}
              className={cn('resize-y', controlInvalidClass(touched.description && !!errors.description))}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Section 2 — Category */}
      <SectionCard
        custom={1}
        step={2}
        icon={<Tag className="h-5 w-5" />}
        title="Category"
        description="Choose the category that best fits this issue."
        complete={sectionStatus.category}
      >
        <div id="field-category" className="mt-5">
          <div
            role="radiogroup"
            aria-label="Issue category"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {REPORT_CATEGORIES.map((cat) => {
              const selected = values.category === cat.slug;
              const CategoryIcon = CATEGORY_ICONS[cat.slug] ?? Tag;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setField('category', cat.slug);
                    setTouched((prev) => ({ ...prev, category: true }));
                  }}
                  disabled={isSubmitting}
                  className={cn(
                    'group relative flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60',
                    selected
                      ? 'border-primary bg-primary/5 shadow-elegant'
                      : 'border-input bg-background hover:border-primary/50 hover:bg-primary/5'
                  )}
                >
                    <span
                      className={cn(
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] transition-colors',
                      selected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    )}
                  >
                    <CategoryIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'flex items-center gap-2 text-sm font-semibold',
                        selected ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      <span className="truncate">{cat.label}</span>
                      <span
                        className={cn(
                          'ml-auto flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
                          selected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                        )}
                      >
                        {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {cat.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {touched.category && errors.category && (
            <p role="alert" className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.category}
            </p>
          )}
        </div>
      </SectionCard>

      {/* Section 3 — Location */}
      <SectionCard
        custom={2}
        step={3}
        icon={<MapPin className="h-5 w-5" />}
        title="Location"
        description="Pin the exact spot on the map so crews can find it."
        complete={sectionStatus.location}
      >
        <div id="field-point" className="mt-5">
          <MapPicker
            value={values.point ? { lat: values.point.coordinates[1], lng: values.point.coordinates[0] } : null}
            onChange={(point) => {
              setField('point', point);
              setTouched((prev) => ({ ...prev, point: true }));
            }}
            address={values.address}
            onAddressChange={(v) => setField('address', v)}
            disabled={isSubmitting}
          />
          {touched.point && errors.point && (
            <p role="alert" className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.point}
            </p>
          )}
        </div>
      </SectionCard>

      {/* Section 4 — Photos */}
      <SectionCard
        custom={3}
        step={4}
        icon={<ImageIcon className="h-5 w-5" />}
        title="Photos"
        description="Add photos to help crews understand the issue. Optional."
        aside={
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
              values.images.length > 0
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {values.images.length}/{5}
          </span>
        }
      >
        <div className="mt-5">
          <ImageUpload
            images={values.images}
            onChange={(images) => setField('images', images)}
            onError={handleImageError}
            disabled={isSubmitting}
          />
        </div>
      </SectionCard>

      {/* Sticky submit bar */}
      <div className="sticky bottom-4 z-20 pt-1">
        <div className="flex flex-col gap-3 rounded-[14px] border border-input bg-card/95 p-4 shadow-elevated backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-success" />
            <span className="text-pretty">
              Your report is reviewed by the city response team.
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {isSubmitting && uploadProgress !== null && (
              <div className="flex items-center gap-2 sm:w-44">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-[9px] h-[44px]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full sm:w-auto rounded-[9px] h-[44px]',
                  errors.form && 'bg-danger text-danger-foreground hover:bg-danger/90'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/** Clean progress indicator summarising required-section completion. */
function FormProgress({
  completedCount,
  status,
}: {
  completedCount: number;
  status: { details: boolean; category: boolean; location: boolean };
}) {
  const total = 3;
  const percent = Math.round((completedCount / total) * 100);

  const steps: Array<{ key: keyof typeof status; label: string }> = [
    { key: 'details', label: 'Details' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
  ];

  return (
    <div className="rounded-[14px] border border-input bg-card p-4 shadow-elegant sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Report progress
        </p>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {completedCount}/{total} complete
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, i) => {
          const done = status[step.key];
          return (
            <div
              key={step.key}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors',
                done
                  ? 'border-success/30 bg-success/5 text-success'
                  : 'border-input bg-muted/40 text-muted-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[9px] text-[10px] font-bold',
                  done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/** Reusable section card with a numbered, animated header. */
function SectionCard({
  custom,
  step,
  icon,
  title,
  description,
  complete = false,
  aside,
  children,
}: {
  custom: number;
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  complete?: boolean;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      custom={custom}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="rounded-[14px] border border-input bg-card p-5 shadow-elegant sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary">
            {icon}
            {complete && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-success-foreground ring-2 ring-card">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
                {String(step).padStart(2, '0')}
              </span>
              {title}
            </h2>
            <p className="text-pretty text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {aside}
      </div>
      {children}
    </motion.section>
  );
}

function SuccessState({
  onReset,
  onViewReports,
}: {
  onReset: () => void;
  onViewReports: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4 rounded-[14px] border border-success/20 bg-success/5 px-6 py-12 text-center shadow-elegant"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle2 className="h-8 w-8" />
      </motion.div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Report submitted!</h2>
        <p className="text-pretty text-sm text-muted-foreground">
          Thank you for helping improve your community. Our team will review
          your report and take action.
        </p>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto rounded-[9px] h-[44px]">
          Submit another report
        </Button>
        <Button onClick={onViewReports} className="w-full sm:w-auto rounded-[9px] h-[44px]">
          View my reports
        </Button>
      </div>
    </motion.div>
  );
}