"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/cart/useCart";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useAuth } from "@/hooks/auth/useAuth";
import { useWallet } from "@/hooks/wallet/useWallet";
import { useCreateOrder } from "@/hooks/order/useCreateOrder";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderSummary from "@/components/checkout/OrderSummery";
import OrderDetails from "@/components/checkout/OrderDetails";
import PaymentMethodSelection from "@/components/checkout/PaymentMethodSelection";
import OrderDetailsSkeleton from "@/components/checkout/OrderDetailsSkeleton";
import PaymentMethodSkeleton from "@/components/checkout/PaymentMethodSkeleton";
import OrderSummarySkeleton from "@/components/checkout/OrderSummerySkeleton";
import { Course as CartCourse } from "@/types/cart";

type PaymentMethodType = "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { data: cartData, isLoading: isCartLoading } = useCart();
  const { data: directCourse, isLoading: isDirectCourseLoading } =
    useGetCourseById(courseId || "");
  const { user } = useAuth();
  const { wallet } = useWallet();
  const createOrder = useCreateOrder();
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType>("WALLET");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const isLoading = courseId ? isDirectCourseLoading : isCartLoading;

  const courseDetails: CartCourse[] = courseId
    ? directCourse
      ? [
          {
            id: directCourse.id,
            title: directCourse.title,
            description: directCourse.description || "",
            thumbnail: directCourse.thumbnail || "",
            price: directCourse.price || 0,
            offer: directCourse.offer || 0,
            duration: directCourse.duration?.toString() || "",
            lectures: directCourse.lessons || 0,
            level: directCourse.level || "BEGINNER",
            creator: {
              name: directCourse.createdBy || "",
            },
          },
        ]
      : []
    : cartData?.items
        .map((item) => item.course)
        .filter((course): course is CartCourse => course !== undefined) || [];

  const totalDiscountedPrice = courseDetails.reduce(
    (total: number, course: CartCourse) => {
      const price =
        typeof course.price === "string"
          ? parseFloat(course.price)
          : course.price;
      const offer = course.offer
        ? typeof course.offer === "string"
          ? parseFloat(course.offer)
          : course.offer
        : price;
      return total + (offer || 0);
    },
    0
  );

  const finalAmount = totalDiscountedPrice - discount;

  useEffect(() => {
    if (!isLoading && courseDetails.length === 0) {
      router.push(courseId ? `/courses/${courseId}` : "/cart");
    }
  }, [courseDetails, isLoading, router, courseId]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      // TODO: Implement coupon validation and discount calculation
      setDiscount(10); // Placeholder discount
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error("Invalid coupon code");
    }
  };

  const handlePaymentMethodSelect = (methodId: PaymentMethodType) => {
    setSelectedMethod(methodId);
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (selectedMethod === "WALLET") {
      if (!wallet || wallet.balance < finalAmount) {
        toast.error("Insufficient wallet balance");
        return;
      }
    }

    try {
      setIsCreatingOrder(true);
      const orderData = {
        courses: courseDetails.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description || "",
          thumbnail: course.thumbnail || "",
          price: Number(course.price),
          offer: course.offer ? Number(course.offer) : Number(course.price),
          duration: course.duration?.toString() || "",
          lectures: course.lectures || 0,
          level: course.level || "",
          creator: {
            name: course.creator?.name || "",
          },
        })),
        paymentMethod: selectedMethod,
        couponCode: couponCode || undefined,
      };

      const response = await createOrder.mutateAsync(orderData);

      if (response.data) {
        if (response.data.session?.url) {
          window.location.href = response.data.session.url;
        } else {
          router.push("/user/my-orders");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">
                Complete your purchase to access your courses
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {courseDetails.length}{" "}
              {courseDetails.length === 1 ? "Course" : "Courses"}
            </Badge>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
              {isLoading ? (
                <OrderDetailsSkeleton />
              ) : (
                <OrderDetails courseDetails={courseDetails} />
              )}
            </Card>

            {/* Payment Method */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
              {isLoading ? (
                <PaymentMethodSkeleton />
              ) : (
                <PaymentMethodSelection
                  onMethodSelect={handlePaymentMethodSelect}
                />
              )}
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6 sticky top-6">
              {isLoading ? (
                <OrderSummarySkeleton />
              ) : (
                <OrderSummary
                  subtotal={totalDiscountedPrice}
                  discount={discount}
                  total={finalAmount}
                  onApplyCoupon={handleApplyCoupon}
                  couponCode={couponCode}
                  onCouponChange={setCouponCode}
                  isPending={isCreatingOrder}
                  onSubmit={handleProceedToPayment}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
