"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { getAllClubs, getClubEvents } from "@/services/clubService"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const clubs = await getAllClubs()
        
        // Fetch events for all clubs
        const allEvents = await Promise.all(
          clubs.map(club => getClubEvents(club.id)
            .then(events => events.map(event => ({
              ...event,
              clubName: club.clubName
            })))
          )
        )

        // Flatten and sort events by date
        const sortedEvents = allEvents
          .flat()
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))

        setEvents(sortedEvents)
      } catch (error) {
        toast.error("Failed to fetch events")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No upcoming events at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.eventPoster && (
                <div className="relative h-48">
                  <img
                    src={event.eventPoster}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                <p className="text-gray-600 mb-4">{event.eventInfo}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.clubName}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(event.eventDate).toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.eventVenue}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}