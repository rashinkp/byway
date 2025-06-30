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
        className="text-primary hover:text-[var(--primary-hover)] font-medium"
      >
        {linkText}
      </Link>
    </p>
  );
}
