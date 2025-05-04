"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Loader2 } from "lucide-react";
import { Path } from "react-hook-form";
import FileUploadComponent, {
  FileUploadStatus,
} from "@/components/FileUploadComponent";

export interface FormFieldConfig<T> {
  name: Path<T>;
  label: string;
  type: "input" | "textarea" | "select";
  fieldType?: "text" | "number" | "file";
  placeholder?: string;
  description?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  size?: "small" | "large";
  accept?: string;
  maxSize?: number;
  fileTypeLabel?: string;
  disabled?: boolean;
}

interface FormModalProps<T extends z.ZodType<any, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  schema: T;
  initialData?: Partial<z.infer<T>>;
  title: string;
  submitText: string;
  fields: FormFieldConfig<z.infer<T>>[];
  description?: string;
  isSubmitting?: boolean;
}

export function FormModal<T extends z.ZodType<any, any>>({
  open,
  onOpenChange,
  onSubmit,
  schema,
  initialData,
  title,
  submitText,
  fields,
  description,
  isSubmitting: externalSubmitting,
}: FormModalProps<T>) {
  const defaultValues = useMemo(
    () =>
      ({
        ...Object.fromEntries(
          fields.map((field) => [
            field.name,
            field.type === "input" && field.fieldType === "number"
              ? undefined // Allow undefined for number fields
              : field.type === "input" || field.type === "textarea"
              ? ""
              : field.fieldType === "file"
              ? undefined
              : undefined,
          ])
        ),
      } as z.infer<T>),
    [fields]
  );

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? { ...defaultValues, ...initialData }
      : defaultValues,
  });

  const isSubmitting = externalSubmitting ?? form.formState.isSubmitting;

  useEffect(() => {
    if (open) {
      form.reset(
        initialData ? { ...defaultValues, ...initialData } : defaultValues
      );
    }
  }, [open, initialData, form, defaultValues]);

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      form.setError("root", {
        message: error.message || "Failed to submit the form",
      });
    }
  };

  // Categorize fields
  const inputFields = fields.filter(
    (field) =>
      (field.type === "input" &&
        (field.fieldType === "text" || field.fieldType === "number")) ||
      field.type === "select"
  );
  const textareaFields = fields.filter((field) => field.type === "textarea");
  const fileFields = fields.filter(
    (field) => field.type === "input" && field.fieldType === "file"
  );

  // Calculate columns for input fields (left and right, max 5 per column)
  const maxFieldsPerColumn = 5;
  const numInputColumns = Math.min(
    2,
    Math.ceil(inputFields.length / maxFieldsPerColumn)
  );
  const inputColumns: FormFieldConfig<z.infer<T>>[][] = Array.from(
    { length: numInputColumns },
    () => []
  );
  inputFields.forEach((field, index) => {
    const columnIndex = index % numInputColumns; // Alternate between left and right
    inputColumns[columnIndex].push(field);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="py-4">
            {form.formState.errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Input fields (text, number, select) in columns */}
            {inputFields.length > 0 && (
              <div
                className={`grid grid-cols-1 sm:grid-cols-${numInputColumns} gap-6 mb-6`}
              >
                {inputColumns.map((columnFields, colIndex) => (
                  <div key={colIndex} className="space-y-6">
                    {columnFields.map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">
                              {field.label}
                            </FormLabel>
                            <FormControl>
                              {field.type === "input" ? (
                                <Input
                                  type={field.fieldType || "text"}
                                  placeholder={field.placeholder}
                                  {...formField}
                                  value={
                                    field.fieldType === "number"
                                      ? formField.value ?? ""
                                      : typeof formField.value === "string"
                                      ? formField.value
                                      : ""
                                  }
                                  onChange={
                                    field.fieldType === "number"
                                      ? (e) =>
                                          formField.onChange(
                                            e.target.value
                                              ? Number(e.target.value)
                                              : undefined
                                          )
                                      : formField.onChange
                                  }
                                  className="h-10 border-gray-300"
                                  disabled={isSubmitting || field.disabled}
                                />
                              ) : field.type === "select" && field.options ? (
                                <Select
                                  value={formField.value as string}
                                  onValueChange={formField.onChange}
                                  disabled={isSubmitting || field.disabled}
                                >
                                  <SelectTrigger className="border-gray-300">
                                    <SelectValue
                                      placeholder={
                                        field.placeholder || "Select an option"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : null}
                            </FormControl>
                            {field.description && (
                              <FormDescription>
                                {field.description}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Textarea fields (full width) */}
            {textareaFields.length > 0 && (
              <div className="space-y-6 mb-6">
                {textareaFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={field.placeholder}
                            {...formField}
                            className="min-h-24 resize-y rounded-xl border-gray-300"
                            disabled={isSubmitting || field.disabled}
                          />
                        </FormControl>
                        {field.description && (
                          <FormDescription>{field.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* File fields (full width) */}
            {fileFields.length > 0 && (
              <div className="space-y-6 mb-6">
                {fileFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          <FileUploadComponent
                            label={field.label}
                            accept={field.accept || "*/*"}
                            maxSize={field.maxSize || 10 * 1024 * 1024}
                            fileTypeLabel={field.fileTypeLabel || "file"}
                            onFileChange={(file, error) => {
                              formField.onChange(file || undefined);
                              if (error) {
                                form.setError(field.name, { message: error });
                              } else {
                                form.clearErrors(field.name);
                              }
                            }}
                            error={form.formState.errors[
                              field.name
                            ]?.message?.toString()}
                            uploadStatus={FileUploadStatus.IDLE}
                            uploadProgress={0}
                          />
                        </FormControl>
                        {field.description && (
                          <FormDescription>{field.description}</FormDescription>
                        )}
                        {field.type !== "input" ||
                        field.fieldType !== "file" ? (
                          <FormMessage />
                        ) : null}
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            <DialogFooter className="pt-6 bg-white pb-4 border-t sticky bottom-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mr-2"
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {submitText}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}