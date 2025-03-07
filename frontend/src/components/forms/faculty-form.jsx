"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FacultyForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
    role: "FACULTY",
    userProfile: {
      department: "",
      designation: "",
      tenureStart: "",
      tenureEnd: "",
      profileIntro: ""
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('userProfile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (field, value) => {
    if (field.includes('userProfile.')) {
      const profileField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userProfile.department">Department</Label>
          <Select 
            name="userProfile.department" 
            onValueChange={(value) => handleSelectChange("userProfile.department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="EEE">EEE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userProfile.designation">Designation</Label>
          <Select 
            name="userProfile.designation" 
            onValueChange={(value) => handleSelectChange("userProfile.designation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userProfile.tenureStart">Tenure Start Date</Label>
          <Input
            id="userProfile.tenureStart"
            name="userProfile.tenureStart"
            type="date"
            value={formData.userProfile.tenureStart}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userProfile.tenureEnd">Tenure End Date</Label>
          <Input
            id="userProfile.tenureEnd"
            name="userProfile.tenureEnd"
            type="date"
            value={formData.userProfile.tenureEnd}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="userProfile.profileIntro">Profile Introduction</Label>
          <Input
            id="userProfile.profileIntro"
            name="userProfile.profileIntro"
            value={formData.userProfile.profileIntro}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Faculty"}
      </Button>
    </form>
  )
} 