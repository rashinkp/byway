
import Main from "@/components/instructor/detail/Main";
import { Suspense } from "react";


export default function InstructorDetailPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Main />
		</Suspense>
	)
}
