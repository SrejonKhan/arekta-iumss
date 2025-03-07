"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EventForm({ clubs, onSubmit, initialData = null }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clubId: initialData?.clubId || "",
    eventName: initialData?.eventName || "",
    eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : "",
    eventTime: initialData?.eventDate ? new Date(initialData.eventDate).toTimeString().slice(0,5) : "",
    eventVenue: initialData?.eventVenue || "",
    eventInfo: initialData?.eventInfo || "",
    eventPoster: initialData?.eventPoster || ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`)
      const submitData = {
        ...formData,
        eventDate: eventDateTime.toISOString(),
      }
      delete submitData.eventTime

      await onSubmit(submitData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!initialData && (
          <div className="space-y-2">
            <Label htmlFor="clubId">Club *</Label>
            <Select 
              name="clubId"
              value={formData.clubId}
              onValueChange={(value) => handleChange({ target: { name: 'clubId', value }})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map(club => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.clubName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name *</Label>
          <Input
            id="eventName"
            name="eventName"
            required
            minLength={2}
            value={formData.eventName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">Date *</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTime">Time *</Label>
          <Input
            id="eventTime"
            name="eventTime"
            type="time"
            required
            value={formData.eventTime}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventVenue">Venue *</Label>
          <Input
            id="eventVenue"
            name="eventVenue"
            required
            minLength={2}
            value={formData.eventVenue}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventPoster">Poster URL</Label>
          <Input
            id="eventPoster"
            name="eventPoster"
            type="url"
            value={formData.eventPoster}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="eventInfo">Event Description *</Label>
          <Textarea
            id="eventInfo"
            name="eventInfo"
            required
            minLength={10}
            value={formData.eventInfo}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : (initialData ? "Update Event" : "Create Event")}
      </Button>
    </form>
  )
} 