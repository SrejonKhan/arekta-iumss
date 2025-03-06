'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  Calendar
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Student Management',
    href: '/admin/students',
    icon: Users
  },
  {
    title: 'Faculty Management',
    href: '/admin/faculty',
    icon: GraduationCap
  },
  {
    title: 'Transport Management',
    href: '/admin/transport',
    icon: Bus
  },
  {
    title: 'Club Management',
    href: '/admin/clubs',
    icon: Users2
  },
  {
    title: 'Cafeteria Management',
    href: '/admin/cafeteria',
    icon: Coffee
  },
  {
    title: 'Academic Management',
    icon: BookOpen,
    subItems: [
      {
        title: 'Courses',
        href: '/admin/academic/courses',
        icon: CourseIcon
      },
      {
        title: 'Schedules',
        href: '/admin/academic/schedules',
        icon: Calendar
      }
    ]
  }
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState(null)

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">IUMSS Admin</h1>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.subItems?.some(subItem => pathname === subItem.href))
              const Icon = item.icon
              
              return (
                <li key={item.title}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition-colors',
                          isActive && 'bg-gray-800 text-white'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.title}</span>
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
                            const SubIcon = subItem.icon
                            const isSubActive = pathname === subItem.href
                            
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    'flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors',
                                    isSubActive && 'bg-gray-800 text-white'
                                  )}
                                >
                                  <SubIcon className="w-4 h-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors',
                        isActive && 'bg-gray-800 text-white'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
