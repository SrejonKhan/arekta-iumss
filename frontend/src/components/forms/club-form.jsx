"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ClubForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clubName: "",
    clubInfo: "",
    clubGoals: ""
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
      await onSubmit(formData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clubName">Club Name *</Label>
          <Input
            id="clubName"
            name="clubName"
            required
            minLength={2}
            value={formData.clubName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clubInfo">Club Description *</Label>
          <Textarea
            id="clubInfo"
            name="clubInfo"
            required
            minLength={10}
            value={formData.clubInfo}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clubGoals">Club Goals *</Label>
          <Textarea
            id="clubGoals"
            name="clubGoals"
            required
            minLength={10}
            value={formData.clubGoals}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Club"}
      </Button>
    </form>
  )
} 