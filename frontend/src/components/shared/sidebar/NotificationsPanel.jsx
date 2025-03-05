"use client"

import { Button } from "@/components/ui/button"
import { Bell as BellIcon, ChevronLeft } from "lucide-react"

const notifications = [
  { text: "New menu items available", time: "5m ago" },
  { text: "Bus route B1 delayed by 5 minutes", time: "10m ago" },
  { text: "Upcoming event: Tech Symposium", time: "1h ago" }
]

const NotificationsPanel = ({ showNotifications, setShowNotifications }) => {
  return (
    <>
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setShowNotifications(false)} />
      )}
      
      {showNotifications && (
        <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l shadow-lg z-50 transform transition-transform translate-x-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BellIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationsPanel 