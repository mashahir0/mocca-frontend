import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Star,
  Gift,
  Grid,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: <Link to="/admin/dashboard">DASHBOARD</Link>,
      icon: LayoutDashboard,
    },
    { label: <Link to="/admin/userlist"> CUSTOMERS</Link>, icon: Users },
    { label: <Link to="/admin/productlist">ALL PRODUCTS</Link>, icon: Package },
    { label: <Link to="/admin/orders">ORDER LIST</Link>, icon: ClipboardList },
    { label: <Link to="/admin/coupon">COUPON</Link>, icon: Star },
    // { label: 'OFFERS', icon: Gift },
    { label: <Link to="/admin/category">CATAGORIES</Link>, icon: Grid },
  ];

  const navigete = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigete("/admin/login");
  };
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">MOCCA</span>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout button */}
          <div className="hidden md:flex items-center">
            <button
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 flex items-center space-x-1"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 w-full text-left flex items-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
