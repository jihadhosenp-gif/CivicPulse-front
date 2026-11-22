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
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
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

/** Smooth section entrance. */
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

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

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Form-level error banner */}
      {errors.form && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4 text-danger"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">We couldn&apos;t submit your report</p>
            <p className="mt-0.5 text-danger/90">{errors.form}</p>
          </div>
        </div>
      )}

      {/* Section 1 — Issue details */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-input bg-card p-6 shadow-elegant"
      >
        <SectionHeader
          icon={<FileText className="h-5 w-5" />}
          title="Issue details"
          description="Give your report a clear title and a helpful description."
        />
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
              className="resize-y"
            />
          </Field>
        </div>
      </motion.div>

      {/* Section 2 — Category */}
      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-input bg-card p-6 shadow-elegant"
      >
        <SectionHeader
          icon={<Tag className="h-5 w-5" />}
          title="Category"
          description="Choose the category that best fits this issue."
        />
        <div id="field-category" className="mt-5">
          <div role="radiogroup" aria-label="Issue category" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_CATEGORIES.map((cat) => {
              const selected = values.category === cat.slug;
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
                    'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-60',
                    selected
                      ? 'border-primary bg-primary/5 shadow-elegant'
                      : 'border-input bg-background hover:border-primary/50 hover:bg-primary/5'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center gap-2 text-sm font-semibold',
                      selected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                        selected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                      )}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    {cat.label}
                  </span>
                  <span className="pl-6 text-xs text-muted-foreground">{cat.hint}</span>
                </button>
              );
            })}
          </div>
          {touched.category && errors.category && (
            <p role="alert" className="mt-2 text-xs font-medium text-danger">
              {errors.category}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section 3 — Location */}
      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-input bg-card p-6 shadow-elegant"
      >
        <SectionHeader
          icon={<MapPin className="h-5 w-5" />}
          title="Location"
          description="Pin the exact spot on the map so crews can find it."
        />
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
            <p role="alert" className="mt-2 text-xs font-medium text-danger">
              {errors.point}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section 4 — Photos */}
      <motion.div
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-input bg-card p-6 shadow-elegant"
      >
        <SectionHeader
          icon={<ImageIcon className="h-5 w-5" />}
          title="Photos"
          description="Add photos to help crews understand the issue. Optional."
          aside={<span className="text-xs text-muted-foreground">{values.images.length}/5</span>}
        />
        <div className="mt-5">
          <ImageUpload
            images={values.images}
            onChange={(images) => setField('images', images)}
            onError={handleImageError}
            disabled={isSubmitting}
          />
        </div>
      </motion.div>

      {/* Sticky submit bar */}
      <div className="sticky bottom-4 z-20">
        <div className="flex flex-col gap-3 rounded-xl border border-input bg-card/95 p-4 shadow-elevated backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            Your report is reviewed by the city response team.
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="sm:w-auto">
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
    </form>
  );
}

function SectionHeader({
  icon,
  title,
  description,
  aside,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {aside}
    </div>
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
      className="flex flex-col items-center gap-4 rounded-xl border border-success/20 bg-success/5 px-6 py-12 text-center shadow-elegant"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Report submitted!</h2>
        <p className="text-sm text-muted-foreground">
          Thank you for helping improve your community. Our team will review
          your report and take action.
        </p>
      </div>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={onReset}>
          Submit another report
        </Button>
        <Button onClick={onViewReports}>View my reports</Button>
      </div>
    </motion.div>
  );
}