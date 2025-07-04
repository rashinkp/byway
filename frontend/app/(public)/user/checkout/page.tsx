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

type PaymentMethodType = "WALLET" | "STRIPE" | "PAYPAL";

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
		} else {
			return (
				cartData?.items
					.map((item) => item.course)
					.filter((course): course is CartCourse => course !== undefined) || []
			);
		}
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
		0,
	);

	const finalAmount = totalDiscountedPrice;

	useEffect(() => {
		if (!isLoading && courseDetails.length === 0) {
			router.push(courseId ? `/courses/${courseId}` : "/cart");
		}
	}, [courseDetails, isLoading, router, courseId]);

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
			};

			const response = await createOrder.mutateAsync(orderData);

			if (response.data) {
				if (selectedMethod === "STRIPE" && response.data.session?.url) {
					window.location.href = response.data.session.url;
				} else if (selectedMethod === "WALLET") {
					router.push(
						`/success?order_id=${response.data.order.id}&type=wallet-payment`,
					);
				}
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to create order");
		} finally {
			setIsCreatingOrder(false);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--color-surface)] p-4 sm:p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<Card className="bg-[var(--color-primary-dark)] rounded-lg p-6">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<div>
							<h1 className="text-2xl font-semibold text-[var(--color-surface)]">
								Checkout
							</h1>
							<p className="text-[var(--color-surface)]/70 mt-1">
								Complete your purchase to access your courses
							</p>
						</div>
						<Badge
							variant="outline"
							className="bg-[var(--color-surface)] text-[var(--color-primary-dark)] border-[var(--color-primary-light)] px-3 py-1 rounded-full text-sm font-medium"
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
						<Card className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-primary-light)]/20 shadow-sm p-6">
							{isLoading ? (
								<OrderDetailsSkeleton />
							) : (
								<OrderDetails courseDetails={courseDetails} />
							)}
						</Card>

						{/* Payment Method */}
						<Card className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-primary-light)]/20 shadow-sm p-6">
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
						<Card className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-primary-light)]/20 shadow-sm p-6 sticky top-6">
							{isLoading ? (
								<OrderSummarySkeleton />
							) : (
								<OrderSummary
									subtotal={totalDiscountedPrice}
									total={finalAmount}
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
