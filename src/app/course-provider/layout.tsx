"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, List, FilePlus, Settings, LogOut, ArrowLeftFromLine,
  ListCheck, CreditCard, BookOpen, Menu, Award,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: <Home size={20} />, href: "/course-provider/dashboard" },
  { id: "enrolled", title: "Enrolled Courses", icon: <ListCheck size={20} />, href: "/course-provider/enrolled-courses" },
  { id: "courses", title: "My Courses", icon: <List size={20} />, href: "/course-provider/courses" },
  { id: "upload", title: "Upload Course", icon: <FilePlus size={20} />, href: "/course-provider/upload-course" },
  { id: "orders", title: "Orders & Earnings", icon: <CreditCard size={20} />, href: "/course-provider/orders" },
  { id: "certificates", title: "Certificates", icon: <Award size={20} />, href: "/course-provider/certificates" },
  { id: "settings", title: "Settings", icon: <Settings size={20} />, href: "/course-provider/settings" },
];

export default function CourseProviderLayout({ children }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/course-provider-login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-none">Eduverse</h2>
            <p className="text-[10px] text-purple-600 font-medium uppercase tracking-wider mt-0.5">Provider Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left group ${
                  active ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <span className={`flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-purple-600"}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-gray-600 hover:bg-gray-100 transition-all"
        >
          <ArrowLeftFromLine size={18} className="flex-shrink-0 text-gray-400" />
          <span className="text-sm font-medium">Back to Site</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-gray-50 text-gray-900 flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white flex flex-col shadow-lg border-r border-gray-100 fixed lg:static inset-y-0 left-0 z-40 w-60 flex-shrink-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 capitalize">
              {menuItems.find((item) => isActive(item.href))?.title || "Dashboard"}
            </h1>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
