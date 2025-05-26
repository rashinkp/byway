"use client";

import { useState, useMemo, useCallback, memo, FC } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/cart/useCart";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useStripe } from "@/hooks/stripe/useStripe"; // Import the custom Stripe hook
import { toast } from "sonner";
import { Course, ICart } from "@/types/cart";
import OrderDetailsSkeleton from "@/components/checkout/OrderDetailsSkeleton";
import OrderDetails from "@/components/checkout/OrderDetails";
import PaymentMethodSkeleton from "@/components/checkout/PaymentMethodSkeleton";
import PaymentMethodSelection from "@/components/checkout/PaymentMethodSelection";
import { useAuth } from "@/hooks/auth/useAuth";
import { OrderSummary } from "@/components/checkout/OrderSummery";
import OrderSummarySkeleton from "@/components/checkout/OrderSummerySkeleton";

interface PaymentMethod {
  id: "razorpay" | "paypal" | "stripe";
  name: string;
}

interface CheckoutPageProps {
  page?: number;
  limit?: number;
}

const CheckoutPage: FC<CheckoutPageProps> = memo(({ page = 1, limit = 10 }) => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { data: cartData, isLoading: cartLoading } = useCart({ page, limit });
  const { data: singleCourse, isLoading: courseLoading } = useGetCourseById(
    courseId as string
  );
  const { createStripeCheckoutSession, isCreatingSession } = useStripe();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod["id"]>("stripe");
  const [couponCode, setCouponCode] = useState<string>("");

  const { user } = useAuth();

  const paypalOptions = useMemo(
    () => ({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "capture",
    }),
    []
  );

  // Calculate totals, tax, and course details
  const {
    totalOriginalPrice,
    totalDiscountedPrice,
    tax,
    finalAmount,
    courseDetails,
  } = useMemo(() => {
    const TAX_RATE = 0.1; // 10% tax rate

    const validatePrice = (
      price: any,
      field: string,
      courseId: string
    ): number => {
      const value = typeof price === "string" ? parseFloat(price) : price;
      if (isNaN(value) || value <= 0) {
        console.error(`Invalid ${field} for course ${courseId}:`, {
          price,
          value,
        });
        return 0;
      }
      return value;
    };

    if (courseId && singleCourse) {
      const price = validatePrice(singleCourse.price, "price", singleCourse.id);
      const offer = validatePrice(
        singleCourse.offer ?? price,
        "offer",
        singleCourse.id
      );
      const calculatedTax = offer * TAX_RATE;
      const finalAmount = offer + calculatedTax;
      return {
        totalOriginalPrice: price,
        totalDiscountedPrice: offer,
        tax: calculatedTax,
        finalAmount,
        courseDetails: [
          {
            id: singleCourse.id,
            title: singleCourse.title || "Unknown Course",
            description: singleCourse.description || "No description available",
            thumbnail: singleCourse.thumbnail || "/default-thumbnail.jpg",
            price,
            offer,
            duration: String(singleCourse.duration ?? "Unknown"),
            level: singleCourse.level || "Unknown",
          } as Course,
        ],
      };
    } else if (cartData?.items) {
      const courses = cartData.items
        .map((item: ICart) => item.course)
        .filter((course): course is NonNullable<ICart["course"]> => !!course)
        .map((course) => {
          const price = validatePrice(course.price, "price", course.id);
          const offer = validatePrice(
            course.offer ?? price,
            "offer",
            course.id
          );
          return {
            id: course.id,
            title: course.title || "Unknown Course",
            description: course.description || "No description available",
            thumbnail: course.thumbnail || "/default-thumbnail.jpg",
            price,
            offer,
            duration: String(course.duration ?? "Unknown"),
            level: course.level || "Unknown",
            lectures: course.lectures ?? 0,
            creator: course.creator ?? { name: "Unknown" },
          } as Course;
        });

      if (courses.length === 0) {
        console.error("No valid courses in cart:", cartData.items);
        toast.error("No valid courses in cart");
        return {
          totalOriginalPrice: 0,
          totalDiscountedPrice: 0,
          tax: 0,
          finalAmount: 0,
          courseDetails: [],
        };
      }

      const totalOriginal = courses.reduce(
        (sum, course) => sum + course.price,
        0
      );
      const totalDiscounted = courses.reduce(
        (sum, course) => sum + course.offer,
        0
      );
      if (totalDiscounted <= 0) {
        console.error("Invalid total discounted price for cart:", {
          totalOriginal,
          totalDiscounted,
          courses,
        });
        toast.error("Invalid cart total");
        return {
          totalOriginalPrice: 0,
          totalDiscountedPrice: 0,
          tax: 0,
          finalAmount: 0,
          courseDetails: [],
        };
      }

      const calculatedTax = totalDiscounted * TAX_RATE;
      const finalAmount = totalDiscounted + calculatedTax;

      return {
        totalOriginalPrice: totalOriginal,
        totalDiscountedPrice: totalDiscounted,
        tax: calculatedTax,
        finalAmount,
        courseDetails: courses,
      };
    }

    return {
      totalOriginalPrice: 0,
      totalDiscountedPrice: 0,
      tax: 0,
      finalAmount: 0,
      courseDetails: [] as Course[],
    };
  }, [courseId, singleCourse, cartData?.items]);

  const coursesInput = useMemo(() => {
    return courseDetails.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      offer: course.offer,

      thumbnail: course.thumbnail,
      duration: course.duration,
      level: course.level,
    }));
  }, [courseDetails]);

  const handlePaymentMethodSelect = useCallback(
    (methodId: PaymentMethod["id"]) => {
      console.log("Selecting payment method:", methodId);
      setSelectedPaymentMethod(methodId);
    },
    []
  );

  const handleProceedToPayment = useCallback(() => {
    if (!courseDetails.length) {
      toast.error("No courses selected for purchase");
      return;
    }
    if (finalAmount <= 0) {
      toast.error("Invalid order amount");
      return;
    }
    setActiveStep(2);
  }, [courseDetails, finalAmount]);

  const handleSubmit = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!courseDetails.length) {
        toast.error("No courses selected for purchase");
        return;
      }
      if (finalAmount <= 0) {
        toast.error("Invalid order amount");
        return;
      }
      if (!user?.id) {
        toast.error("Please log in to proceed with payment");
        return;
      }

      if (selectedPaymentMethod === "stripe") {
        try {
          await createStripeCheckoutSession({
            courses: coursesInput,
            userId: user.id,
            couponCode,
          });
          // No need to set activeStep, as Stripe will redirect to the success page
        } catch (error) {
          console.error("Error creating Stripe checkout session:", error);
          toast.error("Failed to initiate Stripe checkout");
        }
      } else if (selectedPaymentMethod === "paypal") {
        // Handle PayPal payment (existing logic)
        toast.error("PayPal is not implemented yet");
      } else {
        // Handle other payment methods (e.g., Razorpay)
        toast.error("Selected payment method is not supported");
      }
    },
    [
      courseDetails,
      couponCode,
      createStripeCheckoutSession,
      selectedPaymentMethod,
      finalAmount,
      user,
      coursesInput,
    ]
  );

  const isLoading = cartLoading || courseLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 mt-2">
            You're just a few steps away from accessing your course(s)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-7/12 bg-white rounded-lg shadow-md p-6">
            <div className="flex mb-8 border-b pb-4">
              <div
                className={`flex-1 text-center ${
                  activeStep >= 1
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                Order Details
              </div>
              <div
                className={`flex-1 text-center ${
                  activeStep >= 2
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 2
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                Payment
              </div>
            </div>

            {isLoading ? (
              <OrderDetailsSkeleton />
            ) : activeStep === 1 ? (
              <OrderDetails
                courseDetails={courseDetails}
                onProceed={handleProceedToPayment}
                isDisabled={!courseDetails.length || finalAmount <= 0}
              />
            ) : isCreatingSession ? (
              <PaymentMethodSkeleton />
            ) : (
              <PaymentMethodSelection
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={handlePaymentMethodSelect}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onSubmit={handleSubmit}
                isPending={isCreatingSession}
                isDisabled={!courseDetails.length || finalAmount <= 0}
                paypalOptions={paypalOptions}
                finalAmount={finalAmount}
                courses={coursesInput}
              />
            )}
          </div>

          <div className="w-full lg:w-5/12">
            {isLoading ? (
              <OrderSummarySkeleton />
            ) : (
              <OrderSummary
                courses={courseDetails}
                totalDiscountedPrice={totalDiscountedPrice}
                tax={tax}
                finalAmount={finalAmount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CheckoutPage;
