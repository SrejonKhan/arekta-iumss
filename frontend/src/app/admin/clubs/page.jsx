"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, Calendar, Users, Settings } from "lucide-react"
import { toast } from "sonner"
import { getAllClubs } from "@/services/clubService"
import { getClubEvents } from "@/services/eventService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClubsPage() {
  const router = useRouter()
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const columns = [
    {
      accessorKey: "clubName",
      header: "Club Name"
    },
    {
      accessorKey: "clubInfo",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.clubInfo}>
          {row.original.clubInfo}
        </div>
      )
    },
    {
      accessorKey: "clubGoals",
      header: "Goals",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.clubGoals}>
          {row.original.clubGoals}
        </div>
      )
    },
    {
      accessorKey: "clubMembers",
      header: "Members",
      cell: ({ row }) => row.original.clubMembers?.length || 0
    },
    {
      accessorKey: "clubEvents",
      header: "Events",
      cell: ({ row }) => row.original.clubEvents?.length || 0
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/clubs/${row.original.id}/events`)}>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Events
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/admin/clubs/${row.original.id}/members`)}>
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const clubsData = await getAllClubs()
        setClubs(clubsData)

        // Fetch upcoming events for each club
        const allEvents = await Promise.all(
          clubsData.map(club => getClubEvents(club.id))
        )

        // Flatten events array and sort by date
        const sortedEvents = allEvents
          .flat()
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 5) // Take only the next 5 events

        setUpcomingEvents(sortedEvents)
      } catch (error) {
        toast.error(error.message || "Failed to fetch data")
        setClubs([])
        setUpcomingEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Management"
        description="Manage student clubs and their activities"
        actions={
          <Button onClick={() => router.push("/admin/clubs/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Club
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DataTable
            columns={columns}
            data={clubs}
            isLoading={loading}
            pagination
            searchable
          />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.eventName}</h4>
                    <p className="text-sm text-gray-500">{event.eventVenue}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.eventDate).toLocaleDateString()} at{' '}
                      {new Date(event.eventDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center">No upcoming events</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Clubs</span>
                <span className="font-bold">{clubs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Members</span>
                <span className="font-bold">
                  {clubs.reduce((total, club) => total + (club.clubMembers?.length || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Upcoming Events</span>
                <span className="font-bold">{upcomingEvents.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 