"use client";

import { useState, useMemo, useCallback, memo, FC } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/cart/useCart";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useCreateOrder } from "@/hooks/order/useOrder";
import { toast } from "sonner";
import { Course, ICart } from "@/types/cart";
import OrderDetailsSkeleton from "@/components/checkout/OrderDetailsSkeleton";
import OrderDetails from "@/components/checkout/OrderDetails";
import PaymentMethodSkeleton from "@/components/checkout/PaymentMethodSkeleton";
import PaymentMethodSelection from "@/components/checkout/PaymentMethodSelection";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import OrderSummarySkeleton from "@/components/checkout/OrderSummerySkeleton";
import { OrderSummary } from "@/components/checkout/OrderSummery";
import { useAuth } from "@/hooks/auth/useAuth";

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
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod["id"]>("paypal");
  const [orderComplete, setOrderComplete] = useState(false);
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");

  const { user } = useAuth()

  const paypalOptions = useMemo(
    () => ({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "capture",
    }),
    []
  );

  const courseIdsMemo = useMemo(() => {
    if (courseId) {
      return [courseId];
    } else if (cartData?.items) {
      return cartData.items.map((item: ICart) => item.courseId);
    }
    return [];
  }, [courseId, cartData?.items]);

  useMemo(() => {
    setCourseIds(courseIdsMemo);
  }, [courseIdsMemo]);

  // Calculate totals, tax, and course details
  const {
    totalOriginalPrice,
    totalDiscountedPrice,
    tax,
    finalAmount,
    courseDetails,
  } = useMemo(() => {
    const TAX_RATE = 0.1; // 10% tax rate, adjust as needed

    if (courseId && singleCourse) {
      const price =
        typeof singleCourse.price === "string"
          ? parseFloat(singleCourse.price)
          : singleCourse.price ?? 0;
      const offer =
        typeof singleCourse.offer === "string"
          ? parseFloat(singleCourse.offer)
          : singleCourse.offer ?? price;
      const validatedOffer = offer > 0 ? offer : price;
      if (validatedOffer <= 0) {
        console.error("Invalid price for single course:", {
          price,
          offer,
          validatedOffer,
        });
        return {
          totalOriginalPrice: 0,
          totalDiscountedPrice: 0,
          tax: 0,
          finalAmount: 0,
          courseDetails: [],
        };
      }
      const calculatedTax = validatedOffer * TAX_RATE;
      const finalAmount = validatedOffer + calculatedTax;
      return {
        totalOriginalPrice: price,
        totalDiscountedPrice: validatedOffer,
        tax: calculatedTax,
        finalAmount: finalAmount,
        courseDetails: [
          {
            id: singleCourse.id,
            title: singleCourse.title,
            thumbnail: singleCourse.thumbnail,
            image: singleCourse.thumbnail || "",
            price,
            offer: validatedOffer,
            duration: String(singleCourse.duration ?? ""),
            level: singleCourse.level,
          } as Course,
        ],
      };
    } else if (cartData?.items) {
      const courses = cartData.items
        .map((item: ICart) => item.course)
        .filter((course): course is Course => !!course)
        .map((course) => {
          const price =
            typeof course.price === "string"
              ? parseFloat(course.price)
              : course.price ?? 0;
          const offer =
            typeof course.offer === "string"
              ? parseFloat(course.offer)
              : course.offer ?? price;
          const validatedOffer = offer > 0 ? offer : price;
          return {
            id: course.id,
            title: course.title,
            thumbnail: course.thumbnail,
            image: course.image ?? "",
            price,
            offer: validatedOffer,
            duration: String(course.duration ?? ""),
            level: course.level,
            lectures: course.lectures ?? 0,
            creator: course.creator ?? { name: "" },
          };
        });
      const totalOriginal = courses.reduce(
        (sum, course) => sum + Number(course.price),
        0
      );
      const totalDiscounted = courses.reduce(
        (sum, course) => sum + Number(course.offer),
        0
      );
      if (totalDiscounted <= 0) {
        console.error("Invalid total discounted price for cart:", {
          totalOriginal,
          totalDiscounted,
          courses,
        });
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
        finalAmount: finalAmount,
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
  }, [courseId, singleCourse?.id, cartData?.items?.length]);

  const handlePaymentMethodSelect = useCallback(
    (methodId: PaymentMethod["id"]) => {
      console.log("Selecting payment method:", methodId);
      setSelectedPaymentMethod(methodId);
    },
    []
  );

  const handleProceedToPayment = useCallback(() => {
    if (!courseIds.length) {
      toast.error("No courses selected for purchase");
      return;
    }
    if (finalAmount <= 0) {
      toast.error("Invalid order amount");
      return;
    }
    setActiveStep(2);
  }, [courseIds, finalAmount]);

  const handleSubmit = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!courseIds.length) {
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
        // Stripe: Initiate checkout session (handled in PaymentMethodSelection)
        // No need to call createOrder; webhook handles order creation
        setActiveStep(2); // Move to payment step
      } else if (selectedPaymentMethod !== "paypal") {
        createOrder(
          { courseIds, couponCode },
          {
            onSuccess: (order) => {
              console.log(
                `Initiating ${selectedPaymentMethod} payment for order:`,
                order.id
              );
              setOrderComplete(true);
              setActiveStep(3);
              toast.success("Order created successfully!");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          }
        );
      }
    },
    [
      courseIds,
      couponCode,
      createOrder,
      selectedPaymentMethod,
      finalAmount,
      user,
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
              <div
                className={`flex-1 text-center ${
                  activeStep >= 3
                    ? "text-blue-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeStep >= 3
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                Confirmation
              </div>
            </div>

            {isLoading ? (
              <OrderDetailsSkeleton />
            ) : activeStep === 1 ? (
              <OrderDetails
                courseDetails={courseDetails}
                onProceed={handleProceedToPayment}
                isDisabled={!courseIds.length || finalAmount <= 0}
              />
            ) : activeStep === 2 ? (
              isPending ? (
                <PaymentMethodSkeleton />
              ) : (
                <PaymentMethodSelection
                  selectedMethod={selectedPaymentMethod}
                  onMethodSelect={handlePaymentMethodSelect}
                  couponCode={couponCode}
                  onCouponChange={setCouponCode}
                  onSubmit={handleSubmit}
                  isPending={isPending}
                  isDisabled={!courseIds.length || finalAmount <= 0}
                  paypalOptions={paypalOptions}
                  finalAmount={finalAmount}
                  courseIds={courseIds} // Pass courseIds
                />
              )
            ) : (
              <OrderConfirmation />
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
