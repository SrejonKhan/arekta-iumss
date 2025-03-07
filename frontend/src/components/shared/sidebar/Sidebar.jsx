"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import UserProfile from "./UserProfile";
import Navigation from "./Navigation";
import BottomActions from "./BottomActions";
import NotificationsPanel from "./NotificationsPanel";

const Sidebar = ({ children }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're in admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // If we're in admin routes, only render children
  if (isAdminRoute) {
    return <>{children}</>;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white border-r transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <UserProfile isCollapsed={isCollapsed} />

        <div className="py-4 flex flex-col h-[calc(100vh-180px)] overflow-y-auto">
          <Navigation isCollapsed={isCollapsed} />
          <div className="flex-1" />
        </div>

        <BottomActions
          isCollapsed={isCollapsed}
          setShowNotifications={setShowNotifications}
        />
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <NotificationsPanel
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300
        ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        ${isMobileMenuOpen ? "ml-0" : "ml-0"}
      `}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
