"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaBookOpen } from "react-icons/fa";
import Link from "next/link";

const navLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "Our Partners", href: "/our-partners" },
  { label: "Reviews", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
];

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setRole(response.data.data.role);
        })
        .catch(() => {
          setIsLoggedIn(false);
          localStorage.removeItem("authToken");
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setRole("");
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      {/* Main header bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer shrink-0"
          onClick={() => router.push("/home")}
        >
          <span className="text-black">E</span>
          <span className="text-purple-600">duverse</span>
        </h1>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop: Explore dropdown on md, hidden on lg (already using full nav) */}
        <div className="hidden md:flex lg:hidden relative mx-2" ref={navRef}>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-colors"
          >
            Explore <ChevronDown size={15} className={`transition-transform ${navOpen ? "rotate-180" : ""}`} />
          </button>
          {navOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-44 z-50">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar — hidden on xs, visible sm+ */}
        <div className="relative flex-1 max-w-xs mx-3 hidden sm:block">
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0">
          {/* Role-based buttons - hidden on smaller screens to avoid overflow */}
          {role === "super-admin" ? (
            <button
              onClick={() => router.push("/super-admin/dashboard")}
              className="hidden md:block px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-xs font-semibold shrink-0"
            >
              Admin Panel
            </button>
          ) : role === "university" ? (
            <button
              onClick={() => router.push("/university")}
              className="hidden md:block px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-xs font-semibold shrink-0"
            >
              University Panel
            </button>
          ) : role === "course-provider" ? (
            <button
              onClick={() => router.push("/course-provider")}
              className="hidden md:block px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-xs font-semibold shrink-0"
            >
              Provider Panel
            </button>
          ) : (
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => router.push("/university-registration")}
                className="px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-xs font-semibold"
              >
                For Universities
              </button>
              <button
                onClick={() => router.push("/course-provider-registration")}
                className="px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-xs font-semibold"
              >
                For Businesses
              </button>
            </div>
          )}

          <FaBookOpen
            onClick={() => router.push("/enrolled-courses")}
            className="text-gray-700 hover:text-purple-600 cursor-pointer transition-colors"
            size={20}
          />
          <ShoppingCart
            onClick={() => router.push("/cart")}
            className="text-gray-700 hover:text-purple-600 cursor-pointer transition-colors"
            size={20}
          />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-xs font-semibold"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-1.5">
              <button
                onClick={() => router.push("/user-login")}
                className="px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-xs font-semibold"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/user-registration")}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-xs font-semibold"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 text-gray-700 hover:text-purple-600 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
          {/* Mobile Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-2 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Auth & Role Buttons */}
          <div className="px-4 py-3 space-y-2">
            {role === "super-admin" && (
              <button
                onClick={() => { router.push("/super-admin/dashboard"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold"
              >
                Admin Panel
              </button>
            )}
            {role === "university" && (
              <button
                onClick={() => { router.push("/university"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 border border-purple-600 text-purple-600 rounded-xl text-sm font-semibold"
              >
                University Dashboard
              </button>
            )}
            {role === "course-provider" && (
              <button
                onClick={() => { router.push("/course-provider"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold"
              >
                Provider Dashboard
              </button>
            )}
            {!role && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { router.push("/university-registration"); setMobileMenuOpen(false); }} className="py-2.5 border border-purple-600 text-purple-600 rounded-xl text-xs font-semibold">For Universities</button>
                <button onClick={() => { router.push("/course-provider-registration"); setMobileMenuOpen(false); }} className="py-2.5 border border-purple-600 text-purple-600 rounded-xl text-xs font-semibold">For Businesses</button>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button onClick={() => { router.push("/enrolled-courses"); setMobileMenuOpen(false); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700">
                <FaBookOpen size={16} /> My Courses
              </button>
              <button onClick={() => { router.push("/cart"); setMobileMenuOpen(false); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700">
                <ShoppingCart size={16} /> Cart
              </button>
            </div>

            {isLoggedIn ? (
              <button onClick={handleLogout} className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold">
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { router.push("/user-login"); setMobileMenuOpen(false); }} className="py-2.5 border border-purple-600 text-purple-600 rounded-xl text-sm font-semibold">Log in</button>
                <button onClick={() => { router.push("/user-registration"); setMobileMenuOpen(false); }} className="py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold">Sign up</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
