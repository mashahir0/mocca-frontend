import React from "react";
import { Link } from "react-router-dom";

export default function AdminFooter() {
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/policy", label: "Policy" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              MOCCA
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Copyright © {new Date().getFullYear()} Mocca. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
