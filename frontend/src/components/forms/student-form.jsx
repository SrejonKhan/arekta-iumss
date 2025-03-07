"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StudentForm({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
    currentSemester: "",
    department: "",
    levelTerm: "",
    currentCgpa: "",
    requiredCredit: "",
    completedCredit: "",
    ongoingCredit: ""
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Convert credit fields to numbers
      const processedData = {
        ...formData,
        requiredCredit: Number(formData.requiredCredit),
        completedCredit: Number(formData.completedCredit),
        ongoingCredit: Number(formData.ongoingCredit)
      }
      await onSubmit(processedData)
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
          <Label htmlFor="username">Student ID *</Label>
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
          <Label htmlFor="department">Department</Label>
          <Select name="department" onValueChange={(value) => handleSelectChange("department", value)}>
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
          <Label htmlFor="currentSemester">Current Semester</Label>
          <Input
            id="currentSemester"
            name="currentSemester"
            value={formData.currentSemester}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="levelTerm">Level-Term</Label>
          <Input
            id="levelTerm"
            name="levelTerm"
            value={formData.levelTerm}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentCgpa">Current CGPA</Label>
          <Input
            id="currentCgpa"
            name="currentCgpa"
            type="number"
            step="0.01"
            value={formData.currentCgpa}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requiredCredit">Required Credit</Label>
          <Input
            id="requiredCredit"
            name="requiredCredit"
            type="number"
            value={formData.requiredCredit}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="completedCredit">Completed Credit</Label>
          <Input
            id="completedCredit"
            name="completedCredit"
            type="number"
            value={formData.completedCredit}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ongoingCredit">Ongoing Credit</Label>
          <Input
            id="ongoingCredit"
            name="ongoingCredit"
            type="number"
            value={formData.ongoingCredit}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Student"}
      </Button>
    </form>
  )
} 