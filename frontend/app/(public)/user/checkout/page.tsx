"use client";

import { useState, useMemo, useCallback, JSX } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle,
  Lock,
  ChevronRight,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { useCart } from "@/hooks/cart/useCart";
import { useCreateOrder } from "@/hooks/order/useOrder";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { ICart, Course } from "@/types/cart";
import { toast } from "sonner";

interface PaymentMethod {
  id: "razorpay" | "paypal" | "stripe";
  name: string;
  icon: JSX.Element;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    icon: <CreditCard size={20} className="text-blue-700" />,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <DollarSign size={20} className="text-blue-700" />,
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: <CreditCard size={20} className="text-blue-700" />,
  },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId"); // For direct purchase
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: singleCourse, isLoading: courseLoading } = useGetCourseById(
    courseId as string
  );
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod["id"]>("razorpay");
  const [orderComplete, setOrderComplete] = useState(false);
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");

  // Memoize courseIds to prevent unnecessary updates
  useMemo(() => {
    if (courseId) {
      setCourseIds([courseId]);
    } else if (cartData?.items) {
      const ids = cartData.items.map((item: ICart) => item.courseId);
      setCourseIds(ids);
    } else {
      setCourseIds([]);
    }
  }, [courseId, cartData?.items]);

  // Calculate total price and course details
  const { totalOriginalPrice, totalDiscountedPrice, courseDetails } =
    useMemo(() => {
      if (courseId && singleCourse) {
        const price =
          typeof singleCourse.price === "string"
            ? parseFloat(singleCourse.price)
            : singleCourse.price;
        const offer =
          typeof singleCourse.offer === "string"
            ? parseFloat(singleCourse.offer)
            : singleCourse.offer;
        return {
          totalOriginalPrice: price,
          totalDiscountedPrice: offer,
          courseDetails: [singleCourse],
        };
      } else if (cartData?.items) {
        const courses = cartData.items
          .map((item: ICart) => item.course)
          .filter((course): course is Course => !!course)
          .map((course) => ({
            ...course,
            price:
              typeof course.price === "string"
                ? parseFloat(course.price)
                : course.price,
            offer:
              typeof course.offer === "string"
                ? parseFloat(course.offer)
                : course.offer,
          }));
        const totalOriginal = courses.reduce(
          (sum, course) => sum + course.price,
          0
        );
        const totalDiscounted = courses.reduce(
          (sum, course) => sum + course.offer,
          0
        );
        return {
          totalOriginalPrice: totalOriginal,
          totalDiscountedPrice: totalDiscounted,
          courseDetails: courses,
        };
      }
      return {
        totalOriginalPrice: 0,
        totalDiscountedPrice: 0,
        courseDetails: [],
      };
    }, [courseId, singleCourse, cartData?.items]);

  const handlePaymentMethodSelect = useCallback(
    (methodId: PaymentMethod["id"]) => {
      setSelectedPaymentMethod(methodId);
    },
    []
  );

  const handleProceedToPayment = useCallback(() => {
    if (!courseIds.length) {
      toast.error("No courses selected for purchase");
      return;
    }
    setActiveStep(2);
  }, [courseIds]);

  const handleSubmit = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!courseIds.length) {
        toast.error("No courses selected for purchase");
        return;
      }

      createOrder(
        { courseIds, couponCode },
        {
          onSuccess: (order) => {
            // Simulate payment processing (replace with actual gateway integration)
            switch (selectedPaymentMethod) {
              case "razorpay":
                console.log("Initiating Razorpay payment for order:", order.id);
                // TODO: Initialize Razorpay SDK
                break;
              case "paypal":
                console.log("Initiating PayPal payment for order:", order.id);
                // TODO: Initialize PayPal SDK
                break;
              case "stripe":
                console.log("Initiating Stripe payment for order:", order.id);
                // TODO: Initialize Stripe SDK
                break;
            }
            setOrderComplete(true);
            setActiveStep(3);
            toast.success("Order created successfully!");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    },
    [courseIds, couponCode, createOrder, selectedPaymentMethod]
  );

  const isLoading = cartLoading || courseLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 mt-2">
            You're just a few steps away from accessing your course(s)
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout area */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            {/* Steps indicator */}
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

            {activeStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Details
                </h2>
                {isLoading ? (
                  <div className="text-center text-gray-600">
                    Loading courses...
                  </div>
                ) : courseDetails.length === 0 ? (
                  <div className="text-center text-gray-600">
                    No courses selected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseDetails.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-start border-b pb-4"
                      >
                        <div className="bg-blue-100 rounded-md p-2 mr-4">
                          <ShoppingCart className="text-blue-700" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {course.level} Level
                          </p>
                          <p className="text-sm text-gray-600">
                            Duration: {course.duration}
                          </p>
                          <div className="mt-2">
                            <span className="text-gray-600 line-through">
                              $
                              {(typeof course?.price === "string"
                                ? parseFloat(course.price)
                                : course?.price ?? 0
                              ).toFixed(2)}
                            </span>
                            <span className="ml-2 text-blue-700 font-semibold">
                              $
                              {(typeof course?.offer === "string"
                                ? parseFloat(course.offer)
                                : course?.offer ?? 0
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-3 font-semibold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-xl text-blue-700">
                        ${(totalDiscountedPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={isLoading || !courseIds.length}
                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300 disabled:bg-gray-400"
                  >
                    Proceed to Payment
                    <ChevronRight className="ml-2 inline" size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Select Payment Method
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center">
                  <Lock className="text-blue-700 mr-3" size={20} />
                  <span className="text-sm text-blue-800">
                    Your payment information is secure and encrypted
                  </span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-md cursor-pointer transition duration-200 ${
                        selectedPaymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => handlePaymentMethodSelect(method.id)}
                        className="mr-3 text-blue-700 focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        {method.icon}
                        <span className="ml-2 text-gray-800">
                          {method.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending || isLoading || !courseIds.length}
                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300 disabled:bg-gray-400"
                  >
                    {isPending ? "Processing..." : "Complete Purchase"}
                    <ChevronRight className="ml-2 inline" size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && orderComplete && (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your payment was successful. You now have access to your
                  course(s).
                </p>
                <button
                  className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-md font-medium transition duration-300"
                  onClick={() => (window.location.href = "/courses")}
                >
                  Start Learning Now
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="mb-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-gray-800 line-through">
                    ${(totalOriginalPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Discounted Price</span>
                  <span className="text-blue-700 font-semibold">
                    ${(totalDiscountedPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Courses</span>
                  <span className="text-gray-800">{courseDetails.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 font-semibold">
                <span className="text-gray-800">Total</span>
                <span className="text-xl text-blue-700">
                  ${(totalDiscountedPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="mt-6 bg-blue-50 rounded-md p-4 text-sm text-blue-800">
                <div className="flex items-center mb-2">
                  <ShoppingCart className="text-blue-700 mr-2" size={16} />
                  <span className="font-medium">Your Benefits:</span>
                </div>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Lifetime access to course content</li>
                  <li>24/7 community support</li>
                  <li>Certificate of completion</li>
                  <li>30-day money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
