"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, Calendar, Users } from "lucide-react"

const columns = [
  {
    accessorKey: "name",
    header: "Club Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "president",
    header: "President"
  },
  {
    accessorKey: "members",
    header: "Members"
  },
  {
    accessorKey: "advisor",
    header: "Faculty Advisor"
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

const dummyData = [
  {
    name: "Programming Club",
    category: "Technical",
    president: "Alex Johnson",
    members: "45",
    advisor: "Dr. Robert Wilson",
    status: "Active",
    nextEvent: "Code Sprint 2024"
  },
  {
    name: "Photography Society",
    category: "Arts",
    president: "Emma Davis",
    members: "32",
    advisor: "Prof. Sarah Lee",
    status: "Active",
    nextEvent: "Photo Exhibition"
  }
]

const upcomingEvents = [
  {
    name: "Code Sprint 2024",
    club: "Programming Club",
    date: "March 15, 2024",
    time: "10:00 AM"
  },
  {
    name: "Photo Exhibition",
    club: "Photography Society",
    date: "March 20, 2024",
    time: "2:00 PM"
  }
]

export default function ClubsPage() {
  const [clubs] = useState(dummyData)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Management"
        description="Manage student clubs and their activities"
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Club
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">All Clubs</h2>
          <DataTable
            columns={columns}
            data={clubs}
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-gray-500">{event.club}</p>
                    <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Clubs</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Members</span>
                <span className="font-bold">245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Events This Month</span>
                <span className="font-bold">12</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 