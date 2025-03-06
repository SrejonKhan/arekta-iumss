"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { getSemesterWiseRoutine, postSemesterWiseRoutine, SEMESTER_CHOICES } from "@/services/api/semester_wise_routine"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const columns = [
  {
    accessorKey: "day",
    header: "Day"
  },
  {
    accessorKey: "time",
    header: "Time Slot"
  },
  {
    accessorKey: "course_code",
    header: "Course Code"
  },
  {
    accessorKey: "course_title",
    header: "Course Title"
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.type === 'Theory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {row.original.type}
      </div>
    )
  }
]

export default function SchedulesPage() {
  const router = useRouter()
  const [selectedSemester, setSelectedSemester] = useState(SEMESTER_CHOICES.FIRST_SEMESTER)
  const [routineData, setRoutineData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)

  // Function to transform routine data into table format
  const transformRoutineData = (routine) => {
    if (!routine) return []
    
    const tableData = []
    Object.entries(routine).forEach(([day, slots]) => {
      Object.entries(slots).forEach(([time, data]) => {
        if (data) {
          tableData.push({
            day,
            time,
            course_code: data.course_code,
            course_title: data.course_title,
            type: data.type
          })
        }
      })
    })
    return tableData.sort((a, b) => {
      // Sort by day first
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayDiff = days.indexOf(a.day) - days.indexOf(b.day)
      if (dayDiff !== 0) return dayDiff
      
      // Then sort by time
      return a.time.localeCompare(b.time)
    })
  }

  // Fetch routine data
  const fetchRoutine = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSemesterWiseRoutine(selectedSemester)
      const transformedData = transformRoutineData(response)
      setRoutineData(transformedData)
    } catch (error) {
      console.error("Failed to fetch routine:", error)
      setError("Failed to load routine data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Generate new routine
  const handleGenerateRoutine = async () => {
    try {
      setGenerating(true)
      setError(null)
      const response = await postSemesterWiseRoutine(selectedSemester)
      const transformedData = transformRoutineData(response)
      setRoutineData(transformedData)
    } catch (error) {
      console.error("Failed to generate routine:", error)
      setError("Failed to generate new routine. Please try again later.")
    } finally {
      setGenerating(false)
    }
  }

  // Fetch routine data when semester changes
  useEffect(() => {
    fetchRoutine()
  }, [selectedSemester])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule Management"
        description="Manage course schedules and classroom assignments"
        actions={
          <div className="flex gap-4">
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SEMESTER_CHOICES).map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleGenerateRoutine}
              disabled={generating}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
              Generate New
            </Button>
            <Button onClick={() => router.push("/admin/academic/schedules/add")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </div>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={routineData}
        />
      )}
    </div>
  )
} 