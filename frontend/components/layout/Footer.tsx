import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const BywayFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Categories", href: "/categories" },
    { name: "Instructors", href: "/instructors" },
    { name: "About", href: "/about" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/byway", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/byway", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/byway", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/byway", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-base-200 text-base-content py-12 px-4 w-full mt-auto">
      <div className="container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Byway</h2>
            <p className="text-base-content/70 text-sm mb-4">
              Empowering learners worldwide with accessible, high-quality education.
            </p>
            <p className="text-base-content/50 text-sm">
              support@byway.com
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-base-300 rounded-lg flex items-center justify-center hover:bg-base-200 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-base-content/70" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-base-300 pt-6 text-center">
          <p className="text-sm text-base-content/50">
            © {currentYear} Byway. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BywayFooter;
