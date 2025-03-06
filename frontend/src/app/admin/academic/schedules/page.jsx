"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const columns = [
  {
    accessorKey: "courseCode",
    header: "Course Code"
  },
  {
    accessorKey: "section",
    header: "Section"
  },
  {
    accessorKey: "instructor",
    header: "Instructor"
  },
  {
    accessorKey: "day",
    header: "Day"
  },
  {
    accessorKey: "time",
    header: "Time"
  },
  {
    accessorKey: "room",
    header: "Room"
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
    courseCode: "CS101",
    section: "A",
    instructor: "Dr. Robert Wilson",
    day: "Monday",
    time: "09:00 AM - 10:30 AM",
    room: "Room 101",
    status: "Active"
  },
  {
    courseCode: "CS201",
    section: "B",
    instructor: "Dr. Sarah Johnson",
    day: "Wednesday",
    time: "11:00 AM - 12:30 PM",
    room: "Room 203",
    status: "Active"
  }
]

export default function SchedulesPage() {
  const router = useRouter()
  const [schedules] = useState(dummyData)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule Management"
        description="Manage course schedules and classroom assignments"
        actions={
          <Button onClick={() => router.push("/admin/academic/schedules/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={schedules}
      />
    </div>
  )
} 