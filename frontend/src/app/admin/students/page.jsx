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
    accessorKey: "role",
    header: "Role"
  },
  {
    accessorKey: "authType",
    header: "Auth Type"
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
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
      />
    </div>
  )
} 