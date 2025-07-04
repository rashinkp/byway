"use client";
import { useState, useRef } from "react";

interface OtpInputProps {
	length?: number;
	onSubmit: (otp: string) => void;
	isSubmitting: boolean;
}

export function OtpInput({
	length = 6,
	onSubmit,
	isSubmitting,
}: OtpInputProps) {
	const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>(
		Array(length).fill(null),
	);

	const isValidOtp = (otpArray: string[]) =>
		otpArray.join("").length === length && /^\d+$/.test(otpArray.join(""));

	const handleChange = (index: number, value: string) => {
		if (value && !/^\d*$/.test(value)) return;

		const newOtp = [...otp];

		if (value.length > 1) {
			const pastedValues = value.split("").slice(0, length);
			const newFilledOtp = [...Array(length).fill("")];
			pastedValues.forEach((val, idx) => {
				if (idx < length) newFilledOtp[idx] = val;
			});
			setOtp(newFilledOtp);
			const nextIndex = Math.min(index + pastedValues.length, length - 1);
			inputRefs.current[nextIndex]?.focus();
			if (isValidOtp(newFilledOtp)) onSubmit(newFilledOtp.join(""));
			return;
		}

		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}

		if (isValidOtp(newOtp)) onSubmit(newOtp.join(""));
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<div className="flex justify-center gap-2 md:gap-3 mb-6">
			{otp.map((digit, index) => (
				<input
					key={index}
					ref={(el) => {
						inputRefs.current[index] = el;
					}}
					type="text"
					value={digit}
					maxLength={length}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					className="w-10 h-12 md:w-12 md:h-14 text-center text-lg border-2 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
					disabled={isSubmitting}
				/>
			))}
		</div>
	);
}
