export const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const formatPrice = (price: number): string => {
	// Convert to string with 2 decimal places without rounding
	const parts = price.toString().split(".");
	const wholePart = parts[0];
	const decimalPart = parts[1] ? parts[1].padEnd(2, "0").slice(0, 2) : "00";

	// Format the whole number part with commas
	const formattedWhole = new Intl.NumberFormat("en-US").format(
		Number(wholePart),
	);

	return `$${formattedWhole}.${decimalPart}`;
};
