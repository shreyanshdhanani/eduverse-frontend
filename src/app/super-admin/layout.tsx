"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid, LiaShapesSolid, LiaUniversitySolid } from "react-icons/lia";
import { LuNotebookPen } from "react-icons/lu";
import { SuperAdminLogoutService } from "../service/super-admin.service";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/super-admin/dashboard" },
  { id: "users", title: "Students", icon: <PiStudent size={22} />, href: "/super-admin/users" },
  { id: "courseProvider", title: "Course Providers", icon: <LiaChalkboardTeacherSolid size={22} />, href: "/super-admin/course-providers" },
  { id: "university", title: "Universities", icon: <LiaUniversitySolid size={22} />, href: "/super-admin/university" },
  { id: "categories", title: "Categories", icon: <LiaShapesSolid size={22} />, href: "/super-admin/categories" },
  { id: "courses", title: "Manage Courses", icon: <LuNotebookPen size={20} />, href: "/super-admin/courses" },
  { id: "cms", title: "Manage Content", icon: <Layout size={20} />, href: "/super-admin/cms" },
  { id: "settings", title: "Settings", icon: <Settings size={20} />, href: "/super-admin/settings" },
];

export default function AdminLayout({ children }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/super-admin-login");
    } else {
      setIsReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    SuperAdminLogoutService();
    router.push("/super-admin-login");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-white w-64 flex flex-col shadow-lg border-r border-gray-100 flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">Eduverse</h2>
              <p className="text-[10px] text-purple-600 font-medium uppercase tracking-wider mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.id} href={item.href}>
                <button
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left group ${active
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                >
                  <span className={`flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-purple-600"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium flex-1">{item.title}</span>
                  {active && <ChevronRight size={14} className="text-white/60" />}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-700 text-xs font-bold">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Super Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@eduverse.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 capitalize">
              {menuItems.find((item) => isActive(item.href))?.title || "Dashboard"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-500 hover:text-purple-600 transition font-medium">
              ← Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
