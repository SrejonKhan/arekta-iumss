"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, MapPin } from "lucide-react"

const columns = [
  {
    accessorKey: "routeNo",
    header: "Route No"
  },
  {
    accessorKey: "from",
    header: "From"
  },
  {
    accessorKey: "to",
    header: "To"
  },
  {
    accessorKey: "departureTime",
    header: "Departure"
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival"
  },
  {
    accessorKey: "busNo",
    header: "Bus No"
  },
  {
    accessorKey: "capacity",
    header: "Capacity"
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
    routeNo: "R001",
    from: "Main Campus",
    to: "City Center",
    departureTime: "08:00 AM",
    arrivalTime: "08:45 AM",
    busNo: "BUS-001",
    capacity: "45/50",
    status: "Active"
  },
  {
    routeNo: "R002",
    from: "Student Housing",
    to: "Main Campus",
    departureTime: "07:30 AM",
    arrivalTime: "08:00 AM",
    busNo: "BUS-002",
    capacity: "38/50",
    status: "Active"
  }
]

const routeStats = [
  { title: "Total Routes", value: "12" },
  { title: "Active Buses", value: "8" },
  { title: "Total Passengers", value: "450" },
  { title: "On-Time Rate", value: "95%" }
]

export default function TransportPage() {
  const [routes] = useState(dummyData)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport Management"
        description="Manage transport routes and schedules"
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {routeStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Routes Table */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Route Schedule</h2>
        <DataTable
          columns={columns}
          data={routes}
        />
      </div>
    </div>
  )
} 