'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      className
    )}
    {...props}
  >
    {required && <span className="ml-0.5 text-danger">*</span>}
  </LabelPrimitive.Root>
));
FormLabel.displayName = 'FormLabel';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  aside,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
        {aside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
}

export function FormInput({
  label,
  id,
  required = false,
  error,
  hint,
  aside,
  className,
  ...props
}: FormInputProps) {
  return (
    <FormField id={id} label={label} required={required} error={error} hint={hint} aside={aside} className={className}>
      <Input id={id} required={required} aria-invalid={!!error} {...props} />
    </FormField>
  );
}

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  aside?: React.ReactNode;
  className?: string;
}

export function FormTextarea({
  label,
  id,
  required = false,
  error,
  hint,
  aside,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <FormField id={id} label={label} required={required} error={error} hint={hint} aside={aside} className={className}>
      <Textarea id={id} required={required} aria-invalid={!!error} {...props} />
    </FormField>
  );
}

interface FormSelectItem {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  items: FormSelectItem[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function FormSelect({
  label,
  id,
  required = false,
  error,
  hint,
  items,
  value,
  onChange,
  className,
  defaultValue,
  placeholder = `Select ${label}…`,
}: FormSelectProps) {
  return (
    <FormField id={id} label={label} required={required} error={error} hint={hint} className={className}>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={(v: string) => onChange?.(v)}
      >
        <SelectTrigger id={id} aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
              <div className="flex items-center gap-2">
                {item.label}
              </div>
              {item.hint && (
                <span className="ml-auto text-xs text-muted-foreground">{item.hint}</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export { FormLabel };