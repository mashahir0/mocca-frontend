import React from "react";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const navLinks = [
    { text: "Support Center", href: "#" },
    { text: "Investing", href: "#" },
    { text: "Contract", href: "#" },
    { text: "Careers", href: "#" },
    { text: "Blog", href: "#" },
    { text: "FAQs", href: "#" },
  ];

  return (
    <footer className="bg-gray-100 text-gray-700 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              About MOCCA
            </h3>
            <p className="text-sm">
              MOCCA is a forward-thinking fashion brand focused on providing
              high-quality apparel for the modern individual. We specialize in
              unique, contemporary designs that reflect individuality and style,
              catering to all your fashion needs.
            </p>
          </div>

          {/* Fashion Inspiration Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Fashion Inspiration
            </h3>
            <p className="text-sm">
              Stay ahead of the trends with MOCCA! Our collections are inspired
              by the latest fashion movements, from street style to haute
              couture. Whether you're looking for casual chic or bold statement
              pieces, MOCCA brings you the best of contemporary fashion.
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Follow Us</h3>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-700 hover:text-gray-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-sm text-gray-700 hover:text-gray-500 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center py-4 text-xs text-gray-500 border-t border-gray-300 mt-8">
          Copyright © {new Date().getFullYear()} MOCCA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
