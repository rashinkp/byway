import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Receipt, Tag, CreditCard } from "lucide-react";

export default function OrderSummarySkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-gray-900 mb-4">
				<Receipt className="w-5 h-5 text-blue-600" />
				<h2 className="text-lg font-semibold">Order Summary</h2>
			</div>
			<Separator />
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-5 w-24" />
				</div>
				<div className="flex justify-between items-center">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-5 w-24" />
				</div>
				<Separator />
				<div className="flex justify-between items-center">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-7 w-28" />
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 text-gray-900">
					<Tag className="w-5 h-5 text-blue-600" />
					<h3 className="text-sm font-medium">Apply Coupon</h3>
				</div>
				<div className="flex gap-2">
					<Skeleton className="flex-1 h-10 rounded-xl" />
					<Skeleton className="w-20 h-10 rounded-xl" />
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-2 text-gray-900">
					<CreditCard className="w-5 h-5 text-blue-600" />
					<h3 className="text-sm font-medium">Payment Method</h3>
				</div>
				<Skeleton className="h-16 rounded-xl" />
			</div>

			<Skeleton className="w-full h-12 rounded-xl" />
		</div>
	);
}
