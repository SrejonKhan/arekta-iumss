"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Bus,
  Users2,
  Coffee,
  BookOpen,
  ChevronDown,
  BookOpen as CourseIcon,
  Calendar,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Student Management",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Faculty Management",
    href: "/admin/faculty",
    icon: GraduationCap,
  },
  {
    title: "Transport Management",
    href: "/admin/transport",
    icon: Bus,
  },
  {
    title: "Club Management",
    href: "/admin/clubs",
    icon: Users2,
  },
  {
    title: "Cafeteria Management",
    href: "/admin/cafeteria",
    icon: Coffee,
  },
  {
    title: "Academic Management",
    icon: BookOpen,
    subItems: [
      {
        title: "Courses",
        href: "/admin/academic/courses",
        icon: CourseIcon,
      },
      {
        title: "Schedules",
        href: "/admin/academic/schedules",
        icon: Calendar,
      },
    ],
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:transform-none`}
      >
        <div className="p-4">
          <h1 className="text-xl lg:text-2xl font-bold">IUMSS Admin</h1>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                item.subItems?.some((subItem) => pathname === subItem.href);
              const Icon = item.icon;

              return (
                <li key={item.title}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition-colors",
                          isActive && "bg-gray-800 text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            openSubmenu === item.title && "rotate-180"
                          )}
                        />
                      </button>
                      {openSubmenu === item.title && (
                        <ul className="pl-4 mt-2 space-y-2">
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;

                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors text-sm",
                                    isSubActive && "bg-gray-800 text-white"
                                  )}
                                >
                                  <SubIcon className="w-4 h-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors text-sm",
                        isActive && "bg-gray-800 text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
