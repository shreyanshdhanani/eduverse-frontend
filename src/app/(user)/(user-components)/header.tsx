"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
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
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      axios
        .get("http://localhost:3020/api/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRole(response.data.role);
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("authToken");
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Close dropdown on outside click
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
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md relative z-50">
      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer shrink-0"
        onClick={() => router.push("/home")}
      >
        <span className="text-black">E</span>
        <span className="text-purple-600">duverse</span>
      </h1>

      {/* Nav Links — Explore dropdown on small screens, inline on large */}
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

      {/* Mobile nav dropdown */}
      <div className="lg:hidden relative mx-2" ref={navRef}>
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

      {/* Registration Buttons based on role */}
      {role === "super-admin" ? (
        <button
          onClick={() => router.push("/super-admin/dashboard")}
          className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm shrink-0"
        >
          Admin Panel
        </button>
      ) : role === "university" ? (
        <button
          onClick={() => router.push("/university")}
          className="px-4 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-sm shrink-0"
        >
          University Dashboard
        </button>
      ) : role === "course-provider" ? (
        <button
          onClick={() => router.push("/course-provider")}
          className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm shrink-0"
        >
          Course Provider Dashboard
        </button>
      ) : (
        <div className="hidden md:flex gap-2 shrink-0">
          <button
            onClick={() => router.push("/university-registration")}
            className="px-4 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-sm"
          >
            For Universities
          </button>
          <button
            onClick={() => router.push("/course-provider-registration")}
            className="px-4 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-sm"
          >
            For Businesses
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex-1 max-w-xs mx-3 hidden sm:block">
        <input
          type="text"
          placeholder="Search for anything"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
      </div>

      {/* Cart & Auth Buttons */}
      <div className="flex items-center space-x-3 shrink-0">
        <FaBookOpen
          onClick={() => router.push("/enrolled-courses")}
          className="text-gray-700 hover:text-purple-600 cursor-pointer transition-colors"
          size={22}
        />

        <ShoppingCart
          onClick={() => router.push("/cart")}
          className="text-gray-700 hover:text-purple-600 cursor-pointer transition-colors"
          size={22}
        />

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push("/user-login")}
              className="px-4 py-1 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition text-sm"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/user-registration")}
              className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
