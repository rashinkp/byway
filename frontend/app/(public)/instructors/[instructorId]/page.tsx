
import { LoadingSpinner } from "@/components/admin";
import Main from "@/components/instructor/detail/Main";
import { Suspense } from "react";


export default function InstructorDetailPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<Main />
		</Suspense>
	)
}
