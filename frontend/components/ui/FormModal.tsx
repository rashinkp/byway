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
import { X, Save, Loader2 } from "lucide-react";
import { Path } from "react-hook-form";

interface FormFieldConfig<T> {
  name: Path<T>;
  label: string;
  type: "input" | "textarea";
  placeholder: string;
  description?: string;
  maxLength?: number;
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
  // Memoize defaultValues to prevent recreation on every render
  const defaultValues = useMemo(
    () =>
      ({
        ...Object.fromEntries(
          fields.map((field) => [
            field.name,
            field.type === "input" || field.type === "textarea"
              ? ""
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-2"
          >
            {form.formState.errors.root && (
              <FormMessage className="text-red-600">
                {form.formState.errors.root.message}
              </FormMessage>
            )}
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      {field.type === "input" ? (
                        <Input
                          placeholder={field.placeholder}
                          {...formField}
                          className="h-10"
                        />
                      ) : (
                        <Textarea
                          placeholder={field.placeholder}
                          {...formField}
                          className="min-h-24 resize-y"
                        />
                      )}
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="pt-4">
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
