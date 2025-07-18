import Link from "next/link";

interface AuthLinkProps {
	text: string;
	linkText: string;
	href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
	return (
		<p className="auth-text text-black dark:text-white">
			{text}{" "}
			<Link
				href={href}
				className="text-black dark:text-[#facc15] underline font-normal"
			>
				{linkText}
			</Link>
		</p>
	);
}
