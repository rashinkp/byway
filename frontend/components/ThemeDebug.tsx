"use client";
import React from "react";

const vars = [
	"--primary",
	"--secondary",
	"--background",
	"--foreground",
	"--primary-50",
	"--primary-100",
	"--primary-200",
	"--primary-300",
	"--primary-400",
	"--primary-500",
	"--primary-600",
	"--primary-700",
	"--primary-800",
	"--primary-900",
	"--primary-950",
];

export default function ThemeDebug() {
	const updateValues = React.useCallback(() => {
		const computed = getComputedStyle(document.documentElement);
		const newValues: { [key: string]: string } = {};
		vars.forEach((v) => {
			newValues[v] = computed.getPropertyValue(v);
		});
		// setValues(newValues);
	}, []);

	React.useEffect(() => {
		updateValues();
		// Listen for theme changes (next-themes doesn't emit a custom event, so listen to click as a workaround)
		document.addEventListener("click", updateValues);
		return () => {
			document.removeEventListener("click", updateValues);
		};
	}, [updateValues]);

	return (
		<div className="mt-8">
			<h2 className="text-lg font-semibold mb-2 text-[var(--foreground)]">
				Theme Debug
			</h2>
			<table className="w-full border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)]">
				<thead>
					<tr>
						<th className="px-4 py-2 border-b border-[var(--border)] text-left font-medium">
							Variable
						</th>
						<th className="px-4 py-2 border-b border-[var(--border)] text-left font-medium">
							Value
						</th>
						<th className="px-4 py-2 border-b border-[var(--border)] text-left font-medium">
							Swatch
						</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(vars).map(([key, value]) => (
						<tr key={key} className="border-b border-[var(--border)]">
							<td className="px-4 py-2 text-[var(--foreground)]">{key}</td>
							<td className="px-4 py-2 text-[var(--muted-foreground)] font-mono">
								{value}
							</td>
							<td className="px-4 py-2">
								<span
									className="inline-block w-8 h-4 rounded border border-[var(--border)]"
									style={{ background: value }}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
