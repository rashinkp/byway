import Link from "next/link";

interface AuthLinkProps {
	text: string;
	linkText: string;
	href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
	return (
		<p className="auth-text text-[var-(--color-primary-dark)]">
			{text}{" "}
			<Link
				href={href}
				className="text-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] hover:font-medium font-normal"
			>
				{linkText}
			</Link>
		</p>
	);
}
