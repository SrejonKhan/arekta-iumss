"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

const SidebarHeader = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-white">IU</span>
        </div>
        {!isCollapsed && <span className="text-xl font-semibold">IUMSS</span>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex"
      >
        <ChevronLeft className={`h-6 w-6 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
      </Button>
    </div>
  )
}

export default SidebarHeader 