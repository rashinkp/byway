export function formatDate(dateString: Date | null | string | undefined) {
	if (!dateString) return "";

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return "";

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}
