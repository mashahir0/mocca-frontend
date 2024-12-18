import React, { useState } from "react";
import { User, MapPin, Package, CreditCard, Mail, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopProfileNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center space-x-6 w-full">
            <Link
              to="/profile"
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </Link>
            <Link
              to="/address-managment"
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Manage Addresses
            </Link>
            <Link
              to="/orders-list"
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <Package className="mr-2 h-5 w-5" />
              My Orders
            </Link>
            <Link
              to="/wallet"
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              My Wallet
            </Link>
            <Link
              to="/about-us"
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <div className="flex flex-col space-y-4 px-4 py-2">
              <Link
                to="/profile"
                onClick={toggleMobileMenu}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </Link>
              <Link
                to="/address-managment"
                onClick={toggleMobileMenu}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Manage Addresses
              </Link>
              <Link
                to="/orders-list"
                onClick={toggleMobileMenu}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <Package className="mr-2 h-5 w-5" />
                My Orders
              </Link>
              <Link
                to="/wallet"
                onClick={toggleMobileMenu}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                My Wallet
              </Link>
              <Link
                to="/about-us"
                onClick={toggleMobileMenu}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
