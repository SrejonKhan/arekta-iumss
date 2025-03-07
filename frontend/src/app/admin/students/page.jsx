"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { getAllStudents } from "@/services/studentService"

// Define status directly in the file for now
const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

const columns = [
  {
    accessorKey: "username",
    header: "Student ID"
  },
  {
    accessorKey: "displayName",
    header: "Name",
    cell: ({ row }) => row.original.displayName || 'N/A'
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "userProfile.department",
    header: "Department",
    cell: ({ row }) => row.original.userProfile?.department || 'N/A'
  },
  {
    accessorKey: "userProfile.currentSemester",
    header: "Semester",
    cell: ({ row }) => `${row.original.userProfile?.currentSemester || 'N/A'} (${row.original.userProfile?.levelTerm || 'N/A'})`
  },
  {
    accessorKey: "userProfile.currentCgpa",
    header: "CGPA",
    cell: ({ row }) => row.original.userProfile?.currentCgpa || 'N/A'
  },
  {
    accessorKey: "userProfile.completedCredit",
    header: "Credits",
    cell: ({ row }) => {
      const profile = row.original.userProfile
      return profile ? (
        <div className="text-sm">
          <div>Completed: {profile.completedCredit || 0}</div>
          <div>Ongoing: {profile.ongoingCredit || 0}</div>
          <div>Required: {profile.requiredCredit || 0}</div>
        </div>
      ) : 'N/A'
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  }
]

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const data = await getAllStudents()
        setStudents(data)
      } catch (error) {
        toast.error(error.message || "Failed to fetch students")
        setStudents([])
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
        pagination
        searchable
        filterableColumns={[
          {
            id: 'userProfile.department',
            title: 'Department',
            options: [
              { label: 'CSE', value: 'CSE' },
              { label: 'EEE', value: 'EEE' },
              { label: 'ME', value: 'ME' },
              { label: 'CE', value: 'CE' },
            ]
          },
          {
            id: 'userProfile.currentSemester',
            title: 'Semester',
            options: [
              { label: '1st', value: '1' },
              { label: '2nd', value: '2' },
              { label: '3rd', value: '3' },
              { label: '4th', value: '4' },
              { label: '5th', value: '5' },
              { label: '6th', value: '6' },
              { label: '7th', value: '7' },
              { label: '8th', value: '8' },
            ]
          }
        ]}
      />
    </div>
  )
} 