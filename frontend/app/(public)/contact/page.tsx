"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
    .regex(/^[a-zA-Z]/, "Name must start with a letter")
    .regex(/[a-zA-Z]$/, "Name must end with a letter")
    .refine((name) => !/\s{2,}/.test(name), "Name cannot contain consecutive spaces")
    .refine((name) => !/^[^a-zA-Z]*$/.test(name), "Name must contain at least one letter"),
  email: z.string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s\.,!?;:'"()-]+$/, "Subject contains invalid characters")
    .refine((val) => !/\s{2,}/.test(val), "Subject cannot contain consecutive spaces")
    .refine((val) => !/^[^a-zA-Z]*$/.test(val), "Subject must contain at least one letter"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
    .refine((val) => /^[\w\s\.,!?;:'"()-]+$/.test(val), "Message contains invalid characters")
    .refine((val) => !/\s{2,}/.test(val), "Message cannot contain consecutive spaces")
    .refine((val) => !/^[^a-zA-Z]*$/.test(val), "Message must contain at least one letter"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual contact form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@byway.com", "info@byway.com"],
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Learning Street", "Education City, EC 12345"],
      description: "Come say hello at our office",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM"],
      description: "We're here to help",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-[#facc15] mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Your message has been sent successfully. We'll get back to you within 24 hours.
              </p>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#facc15] text-black hover:bg-yellow-400 dark:text-black dark:bg-[#facc15] dark:hover:bg-yellow-400"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white dark:bg-[#232323] rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
              Send us a Message
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id="name"
                              {...field}
                              className="w-full border-gray-300 dark:border-gray-600 dark:bg-[#18181b] dark:text-white"
                              placeholder="Your full name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id="email"
                              {...field}
                              className="w-full border-gray-300 dark:border-gray-600 dark:bg-[#18181b] dark:text-white"
                              placeholder="your.email@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="subject"
                            {...field}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-[#18181b] dark:text-white"
                            placeholder="What's this about?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="message"
                            {...field}
                            rows={6}
                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-[#18181b] dark:text-white resize-none"
                            placeholder="Tell us more about your inquiry..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#facc15] text-black hover:bg-yellow-400 dark:bg-[#facc15] dark:text-black dark:hover:bg-yellow-400 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#facc15]/10 dark:bg-[#facc15]/20 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-[#facc15]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {info.description}
                    </p>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-sm text-gray-700 dark:text-gray-200">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Our Location
              </h3>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Interactive map coming soon
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    123 Learning Street, Education City, EC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#232323] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                How do I enroll in a course?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our course catalog, select a course, and click "Enroll Now" to get started with your learning journey.
              </p>
            </div>
            <div className="bg-white dark:bg-[#232323] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and wallet payments for your convenience.
              </p>
            </div>
            <div className="bg-white dark:bg-[#232323] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all courses. Contact our support team for assistance.
              </p>
            </div>
            <div className="bg-white dark:bg-[#232323] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                How do I become an instructor?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click "Teach on Byway" in your profile menu to apply. We'll review your application and get back to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 