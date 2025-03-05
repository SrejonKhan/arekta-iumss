"use client"

import { Button } from "@/components/ui/button"
import { Bell as BellIcon, LogOut } from "lucide-react"

const BottomActions = ({ isCollapsed, setShowNotifications }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setShowNotifications(prev => !prev)}
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </Button>
        {!isCollapsed && (
          <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Logout</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default BottomActions 