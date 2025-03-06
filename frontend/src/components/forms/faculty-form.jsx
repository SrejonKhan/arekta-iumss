"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Economics",
]

const designations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Research Associate"
]

export function FacultyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    facultyId: "",
    department: "",
    designation: "",
    specialization: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              name="displayName"
              placeholder="Dr. John Doe"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Faculty ID</label>
            <Input
              name="facultyId"
              placeholder="FAC2024001"
              value={formData.facultyId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select 
              onValueChange={(value) => handleSelectChange('department', value)} 
              value={formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Designation</label>
            <Select 
              onValueChange={(value) => handleSelectChange('designation', value)}
              value={formData.designation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {designations.map((designation) => (
                  <SelectItem key={designation} value={designation}>
                    {designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specialization</label>
            <Input
              name="specialization"
              placeholder="e.g., Machine Learning"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit">
          Add Faculty
        </Button>
      </div>
    </form>
  )
} 