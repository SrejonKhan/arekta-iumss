"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getClubEvents, createEvent, updateEvent, deleteEvent } from "@/services/eventService"
import { getAllClubs } from "@/services/clubService"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "@/components/forms/event-form"

export default function ClubEventsPage({ params }) {
  const clubId = use(params).clubId
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDialog, setShowEventDialog] = useState(false)

  const columns = [
    {
      accessorKey: "eventName",
      header: "Event Name"
    },
    {
      accessorKey: "eventDate",
      header: "Date & Time",
      cell: ({ row }) => {
        const date = new Date(row.original.eventDate)
        return (
          <div>
            <div>{date.toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString()}</div>
          </div>
        )
      }
    },
    {
      accessorKey: "eventVenue",
      header: "Venue"
    },
    {
      accessorKey: "eventInfo",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.eventInfo}>
          {row.original.eventInfo}
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditEvent(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteEvent(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  useEffect(() => {
    fetchEvents()
    fetchClubs()
  }, [clubId])

  const fetchClubs = async () => {
    try {
      const data = await getAllClubs()
      setClubs(data)
    } catch (error) {
      toast.error("Failed to fetch clubs")
    }
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getClubEvents(clubId)
      setEvents(data)
    } catch (error) {
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleDeleteEvent = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(clubId, eventId)
        toast.success("Event deleted successfully")
        fetchEvents()
      } catch (error) {
        toast.error(error.message || "Failed to delete event")
      }
    }
  }

  const handleEventSubmit = async (data) => {
    try {
      if (selectedEvent) {
        await updateEvent(clubId, selectedEvent.id, data)
        toast.success("Event updated successfully")
      } else {
        await createEvent(clubId, data)
        toast.success("Event created successfully")
      }
      setShowEventDialog(false)
      fetchEvents()
    } catch (error) {
      toast.error(error.message || "Failed to save event")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Events"
        description="Manage club events and activities"
        actions={
          <Button onClick={() => setShowEventDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={events}
        isLoading={loading}
        pagination
        searchable
      />

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            clubs={clubs}
            initialData={selectedEvent ? { ...selectedEvent, clubId } : { clubId }}
            onSubmit={handleEventSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 