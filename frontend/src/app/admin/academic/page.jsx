"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, BookOpen, Users, Clock, Calendar } from "lucide-react"

const courseColumns = [
  {
    accessorKey: "code",
    header: "Course Code"
  },
  {
    accessorKey: "name",
    header: "Course Name"
  },
  {
    accessorKey: "department",
    header: "Department"
  },
  {
    accessorKey: "instructor",
    header: "Instructor"
  },
  {
    accessorKey: "credits",
    header: "Credits"
  },
  {
    accessorKey: "students",
    header: "Enrolled"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {row.original.status}
      </div>
    )
  }
]

const scheduleColumns = [
  {
    accessorKey: "time",
    header: "Time"
  },
  {
    accessorKey: "course",
    header: "Course"
  },
  {
    accessorKey: "instructor",
    header: "Instructor"
  },
  {
    accessorKey: "room",
    header: "Room"
  }
]

const courses = [
  {
    code: "CS101",
    name: "Introduction to Programming",
    department: "Computer Science",
    instructor: "Dr. Robert Wilson",
    credits: "3",
    students: "45",
    status: "Active"
  },
  {
    code: "MATH201",
    name: "Advanced Calculus",
    department: "Mathematics",
    instructor: "Dr. Sarah Johnson",
    credits: "4",
    students: "38",
    status: "Active"
  }
]

const schedules = [
  {
    time: "09:00 AM - 10:30 AM",
    course: "CS101",
    instructor: "Dr. Robert Wilson",
    room: "Room 101"
  },
  {
    time: "11:00 AM - 12:30 PM",
    course: "MATH201",
    instructor: "Dr. Sarah Johnson",
    room: "Room 205"
  }
]

const stats = [
  {
    title: "Total Courses",
    value: "24",
    icon: BookOpen
  },
  {
    title: "Total Students",
    value: "450",
    icon: Users
  },
  {
    title: "Active Classes",
    value: "12",
    icon: Clock
  },
  {
    title: "Upcoming Exams",
    value: "8",
    icon: Calendar
  }
]

export default function AcademicPage() {
  const [courseList] = useState(courses)
  const [scheduleList] = useState(schedules)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Management"
        description="Manage courses, schedules, and academic activities"
        actions={
          <div className="flex space-x-4">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Course List</h2>
        <DataTable
          columns={courseColumns}
          data={courseList}
        />
      </div>

      {/* Schedule */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <DataTable
          columns={scheduleColumns}
          data={scheduleList}
        />
      </div>
    </div>
  )
} 