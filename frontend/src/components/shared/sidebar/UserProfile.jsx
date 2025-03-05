"use client"

import { User } from "lucide-react"

const UserProfile = ({ isCollapsed }) => {
  return (
    <div className={`p-4 border-b ${isCollapsed ? "text-center" : ""}`}>
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-600">Student</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile 