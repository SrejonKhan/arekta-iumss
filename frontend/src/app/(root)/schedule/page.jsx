"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getRoutineBySemester } from "@/services/routineService"
import { toast } from "sonner"

export default function SchedulePage() {
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userProfile = user.userProfile

        // Get current semester from level-term
        const currentSemester = userProfile.currentSemester || "1"

        const data = await getRoutineBySemester(currentSemester)
        setRoutine(data.routine)
      } catch (error) {
        toast.error("Failed to load routine")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutine()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
  const timeSlots = [
    '08:30 AM - 09:30 AM',
    '09:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '12:30 PM - 01:30 PM',
    '01:30 PM - 02:30 PM'
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Class Schedule</h1>
      
      <div className="overflow-x-auto">
        <Card className="p-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50">Time</th>
                {days.map(day => (
                  <th key={day} className="border p-2 bg-gray-50">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border p-2 font-medium bg-gray-50">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const class_ = routine?.[day]?.[timeSlot]
                    
                    return (
                      <td 
                        key={`${day}-${timeSlot}`} 
                        className={`border p-2 ${
                          class_?.type === 'Sessional' ? 'bg-blue-50' : 
                          class_?.type === 'Theory' ? 'bg-green-50' : ''
                        }`}
                      >
                        {class_ ? (
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {class_.course_code}
                            </div>
                            <div className="text-sm">
                              {class_.course_title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {class_.type}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Legend */}
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border"></div>
            <span className="text-sm">Sessional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border"></div>
            <span className="text-sm">Theory</span>
          </div>
        </div>
      </div>
    </div>
  )
}
