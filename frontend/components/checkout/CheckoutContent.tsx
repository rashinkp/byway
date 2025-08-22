"use client";

import { useState, useEffect, useMemo } from "react";
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
import { PaymentMethodType } from "@/types/checkout";



export default function CheckoutContent() {
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

  const courseDetails: CartCourse[] = useMemo(() => {
    if (courseId) {
      if (directCourse) {
        return [
          {
            id: directCourse.id,
            title: directCourse.title,
            description: directCourse.description || "",
            thumbnail: directCourse.thumbnail || "",
            price: Number(directCourse.price) || 0,
            offer: Number(directCourse.offer) || 0,
            duration: directCourse.duration?.toString() || "",
            lectures: directCourse.lessons || 0,
            level: directCourse.level || "BEGINNER",
            creator: {
              name: directCourse.createdBy || "",
            },
          },
        ];
      }
      return [];
    }
    return cartData?.items
      .map((item) => item.course)
      .filter((course): course is CartCourse => course !== undefined) || [];
  }, [courseId, directCourse, cartData]);

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
    } catch {
      toast.error("Invalid coupon code");
    }
  };

  const handlePaymentMethodSelect = (methodId: PaymentMethodType) => {
    setSelectedMethod(methodId);
  };

  const handleProceedToPayment = async () => {
    if (!user) {
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
    description: course.description ?? null, // backend expects string|null
    level: course.level || "",
    price: Number(course.price),
    thumbnail: course.thumbnail ?? null,

    // Backend-required fields ↓
    status: "active", 
    createdBy: course.creator?.name || "", // map from creator object
    createdAt: new Date().toISOString(), // or actual created date
    updatedAt: undefined,
    deletedAt: null,
    approvalStatus: "pending", // or actual status

    details: {
      prerequisites: null,
      longDescription: null,
      objectives: null,
      targetAudience: null,
    },

    offer: course.offer ? Number(course.offer) : undefined,
  })),
  paymentMethod: selectedMethod,
  couponCode: couponCode || undefined,
};

const response = await createOrder.mutateAsync(orderData);


      if (response.data) {
        if (selectedMethod === "STRIPE" && response.data.session?.url) {
          window.location.href = response.data.session.url;
        } else if (selectedMethod === "WALLET") {
          router.push(`/success?order_id=${response.data.order.id}&type=wallet-payment`);
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to create order");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="dark:bg-[#18181b]  p-6 shadow-none border-none">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-black dark:text-[#facc15]">Checkout</h1>
              <p className="text-black/70 dark:text-[#facc15]/70 mt-1">
                Complete your purchase to access your courses
              </p>
            </div>
            <Badge
              className="bg-white dark:bg-[#232323]  text-black dark:text-[#facc15] border border-[#facc15] px-3 py-1 rounded-full text-sm font-medium"
            >
              {courseDetails.length} {courseDetails.length === 1 ? "Course" : "Courses"}
            </Badge>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            <Card className="bg-white dark:bg-[#232323]  p-6 shadow-none border-none">
              {isLoading ? (
                <OrderDetailsSkeleton />
              ) : (
                <OrderDetails courseDetails={courseDetails} />
              )}
            </Card>

            {/* Payment Method */}
            <Card className="bg-white dark:bg-[#232323] shadow-none border-none p-6">
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
            <Card className="bg-gray-100 dark:bg-[#232323] shadow-none border-none p-6 sticky top-6">
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