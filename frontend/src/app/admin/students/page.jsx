"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"

// Define status directly in the file for now
const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

const columns = [
  {
    accessorKey: "studentId",
    header: "Student ID"
  },
  {
    accessorKey: "displayName",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "department",
    header: "Department"
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => `${row.original.semester}${getSemesterSuffix(row.original.semester)}`
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.original.status === UserStatus.ACTIVE ? 'Active' : 'Inactive'}
      </div>
    )
  }
]

function getSemesterSuffix(semester) {
  if (semester === 1) return 'st'
  if (semester === 2) return 'nd'
  if (semester === 3) return 'rd'
  return 'th'
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating data fetch for now
    const fetchStudents = async () => {
      try {
        setLoading(true)
        // Temporary mock data
        const mockStudents = [
          {
            studentId: "2024001",
            displayName: "John Doe",
            email: "john@example.com",
            department: "Computer Science",
            semester: 1,
            status: UserStatus.ACTIVE
          },
          // Add more mock data as needed
        ]
        
        setStudents(mockStudents)
      } catch (error) {
        toast.error("Failed to fetch students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Manage all students in the system"
        actions={
          <Button onClick={() => router.push("/admin/students/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={students}
        isLoading={loading}
      />
    </div>
  )
} 