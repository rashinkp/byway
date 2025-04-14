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
        className="text-primary hover:text-primary/80 font-medium"
      >
        {linkText}
      </Link>
    </p>
  );
}
