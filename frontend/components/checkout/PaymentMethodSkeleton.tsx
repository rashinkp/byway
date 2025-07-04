import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

export default function PaymentMethodSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-gray-900 mb-4">
				<CreditCard className="w-5 h-5 text-blue-600" />
				<h2 className="text-lg font-semibold">Payment Method</h2>
			</div>
			<Separator />
			<div className="space-y-4">
				{[1, 2, 3, 4].map((index) => (
					<div key={index} className="p-4 rounded-xl border-2 border-gray-200">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Skeleton className="w-10 h-10 rounded-lg" />
								<div>
									<Skeleton className="h-5 w-24 mb-2" />
									<Skeleton className="h-4 w-40" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
