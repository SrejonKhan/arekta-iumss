"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import SidebarHeader from "./SidebarHeader"
import UserProfile from "./UserProfile"
import Navigation from "./Navigation"
import BottomActions from "./BottomActions"
import NotificationsPanel from "./NotificationsPanel"

const Sidebar = ({ children }) => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Check if we're in admin routes
  const isAdminRoute = pathname.startsWith('/admin')

  // If we're in admin routes, only render children
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-white border-r transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}>
        <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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

      <NotificationsPanel 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      {/* Main Content Area */}
      <div className={`flex-1 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        {children}
      </div>
    </div>
  )
}

export default Sidebar 