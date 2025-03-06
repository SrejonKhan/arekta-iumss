"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const columns = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "name",
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
    accessorKey: "designation",
    header: "Designation"
  },
  {
    accessorKey: "specialization",
    header: "Specialization"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.original.status}
      </div>
    )
  }
]

const dummyData = [
  {
    id: "FAC001",
    name: "Dr. Robert Wilson",
    email: "robert@example.com",
    department: "Computer Science",
    designation: "Professor",
    specialization: "Machine Learning",
    status: "Active"
  },
  {
    id: "FAC002",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    department: "Electrical Engineering",
    designation: "Associate Professor",
    specialization: "Power Systems",
    status: "Active"
  }
]

export default function FacultyPage() {
  const router = useRouter()
  const [faculty] = useState(dummyData)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Management"
        description="Manage faculty members and their information"
        actions={
          <Button onClick={() => router.push("/admin/faculty/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Faculty
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={faculty}
      />
    </div>
  )
} 