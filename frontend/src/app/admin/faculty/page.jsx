"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { getAllFaculty } from "@/services/facultyService"

const columns = [
  {
    accessorKey: "username",
    header: "Faculty ID"
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
    accessorKey: "userProfile.designation",
    header: "Designation",
    cell: ({ row }) => row.original.userProfile?.designation || 'N/A'
  },
  {
    accessorKey: "userProfile.tenureInfo",
    header: "Tenure",
    cell: ({ row }) => {
      const profile = row.original.userProfile
      if (!profile?.tenureStart && !profile?.tenureEnd) return 'Not Set'
      
      const start = profile.tenureStart ? new Date(profile.tenureStart).toLocaleDateString() : 'N/A'
      const end = profile.tenureEnd ? new Date(profile.tenureEnd).toLocaleDateString() : 'N/A'
      
      return (
        <div className="text-sm">
          <div>Start: {start}</div>
          <div>End: {end}</div>
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    accessorKey: "userProfile.profileIntro",
    header: "Profile Intro",
    cell: ({ row }) => {
      const intro = row.original.userProfile?.profileIntro
      return intro ? (
        <div className="max-w-xs truncate" title={intro}>
          {intro}
        </div>
      ) : 'N/A'
    }
  }
]

export default function FacultyPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true)
        const data = await getAllFaculty()
        setFaculty(data)
      } catch (error) {
        toast.error(error.message || "Failed to fetch faculty members")
        setFaculty([])
      } finally {
        setLoading(false)
      }
    }

    fetchFaculty()
  }, [])

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
            id: 'userProfile.designation',
            title: 'Designation',
            options: [
              { label: 'Professor', value: 'Professor' },
              { label: 'Associate Professor', value: 'Associate Professor' },
              { label: 'Assistant Professor', value: 'Assistant Professor' },
              { label: 'Lecturer', value: 'Lecturer' },
            ]
          }
        ]}
      />
    </div>
  )
} 