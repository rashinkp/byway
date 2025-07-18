import Link from "next/link";

interface AuthLinkProps {
	text: string;
	linkText: string;
	href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
	return (
		<p className="auth-text text-black">
			{text}{" "}
			<Link
				href={href}
				className="text-black hover:text-[#d97706] underline font-normal transition-colors"
			>
				{linkText}
			</Link>
		</p>
	);
}
