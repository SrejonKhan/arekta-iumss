"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Coffee,
  Bus,
  Calendar,
  Map,
  BookOpen,
} from "lucide-react"

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { 
    name: 'Academic',
    icon: BookOpen,
    children: [
      { name: 'Class Schedule', path: '/schedule', icon: Calendar },
      { name: 'Faculty', path: '/faculty', icon: BookOpen },
    ]
  },
  { name: 'Cafeteria', path: '/cafeteria', icon: Coffee },
  { name: 'Transport', path: '/transport', icon: Bus },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Campus Map', path: '/navigation', icon: Map },
]

const Navigation = ({ isCollapsed }) => {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 px-2">
      {navigationItems.map((item) => (
        <div key={item.name}>
          {item.children ? (
            <div className="space-y-1">
              <div className={`flex items-center px-3 py-2 text-gray-600 ${
                isCollapsed ? "justify-center" : ""
              }`}>
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </div>
              {!isCollapsed && (
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                        pathname === child.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <child.icon className="h-4 w-4" />
                      <span className="ml-3">{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Navigation 