import Link from "next/link";

interface AuthLinkProps {
	text: string;
	linkText: string;
	href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
	return (
		<p className="auth-text">
			{text}{" "}
			<Link
				href={href}
				className="text-[var(--primary-500)] hover:text-[var(--primary-600)] font-normal"
			>
				{linkText}
			</Link>
		</p>
	);
}
