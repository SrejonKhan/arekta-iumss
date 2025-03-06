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

export function CourseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    department: "",
    creditHours: "",
    instructor: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDepartmentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      department: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course Code</label>
            <Input
              name="courseCode"
              placeholder="CS101"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Course Title</label>
            <Input
              name="title"
              placeholder="Introduction to Programming"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Hours</label>
            <Input
              name="creditHours"
              type="number"
              min="1"
              max="6"
              placeholder="3"
              value={formData.creditHours}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select onValueChange={handleDepartmentChange} value={formData.department}>
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
            <label className="text-sm font-medium">Instructor</label>
            <Input
              name="instructor"
              placeholder="Dr. John Doe"
              value={formData.instructor}
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
          Add Course
        </Button>
      </div>
    </form>
  )
} 