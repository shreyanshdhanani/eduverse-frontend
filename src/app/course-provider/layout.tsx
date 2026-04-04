"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  List,
  FilePlus,
  Edit,
  Settings,
  LogOut,
  Bell,
  UserCircle,
  ArrowLeftFromLine,
  Video,
  ListCheck,
  CreditCard,
} from "lucide-react"; // Adding Video Icon for Live Lecture
import Link from "next/link";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: <Home />, href: "/course-provider/dashboard" },
  { id: "enrolled", title: "Enrolled Courses", icon: <ListCheck />, href: "/course-provider/enrolled-courses" },
  { id: "courses", title: "My Courses", icon: <List />, href: "/course-provider/courses" },
  { id: "upload", title: "Upload Course", icon: <FilePlus />, href: "/course-provider/upload-course" },
  { id: "orders", title: "Orders & Earnings", icon: <CreditCard />, href: "/course-provider/orders" },
  { id: "settings", title: "Settings", icon: <Settings />, href: "/course-provider/settings" },
];

export default function CourseProviderDashboard({ children }: any) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
    } else {
      setActiveSection(pathname);
    }
  }, [pathname]);

  const handleBackToHome = () => {
    router.push('/'); // Navigate to the homepage
  };

  const handleMenuClick = (id: string, href: string) => {
    setActiveSection(id);
    localStorage.setItem("activeSection", id); // Save to localStorage
  };

  return (
    <div className="bg-gray-100 text-gray-900 flex h-screen">
      {/* Sidebar */}
      <aside className="bg-white w-64 p-5 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Course Provider Dashboard</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href} passHref>
              <button
                onClick={() => handleMenuClick(item.id, item.href)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition w-full text-left ${
                  activeSection === item.id
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-200 text-gray-900"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            </Link>
          ))}
          <button onClick={handleBackToHome} className="flex items-center bg-gray-200 space-x-3 p-3 rounded-lg transition w-full text-left hover:bg-gray-200">
            <ArrowLeftFromLine />
            <span>Back To Home</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white flex justify-between items-center p-5 shadow-md">
          <h1 className="text-xl font-bold capitalize">
            {menuItems.find((item) => item.id === activeSection)?.title || "Dashboard"}
          </h1>
        </header>

        {/* Dynamic Content */}
        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
