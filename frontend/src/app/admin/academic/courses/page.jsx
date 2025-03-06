"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { getAllCourses } from "@/services/api/all_course"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const columns = [
  {
    accessorKey: "course_code",
    header: "Course Code"
  },
  {
    accessorKey: "course_title",
    header: "Course Title"
  },
  {
    accessorKey: "credit",
    header: "Credit Hours"
  },
  {
    accessorKey: "isSessional",
    header: "Type",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.isSessional ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        {row.original.isSessional ? 'Sessional' : 'Theory'}
      </div>
    )
  }
]

const semesters = [
  "First Semester",
  "Second Semester",
  "Third Semester",
  "Fourth Semester",
  "Fifth Semester",
  "Sixth Semester",
  "Seventh Semester",
  "Eighth Semester"
]

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState("First Semester")
  const [semesterCredits, setSemesterCredits] = useState(0)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await getAllCourses()
        setCourses(data)
      } catch (error) {
        toast.error(error.message || "Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses by selected semester
  const filteredCourses = courses.filter(
    course => course.semester === selectedSemester
  )

  // Calculate total credits for selected semester
  useEffect(() => {
    const total = filteredCourses.reduce((sum, course) => sum + course.credit, 0)
    setSemesterCredits(total)
  }, [selectedSemester, courses])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Manage academic courses and their details"
        actions={
          <Button onClick={() => router.push("/admin/academic/courses/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select 
              value={selectedSemester} 
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500">
            Total Credits: <span className="font-medium text-gray-900">{semesterCredits}</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCourses}
        isLoading={loading}
      />
    </div>
  )
} 