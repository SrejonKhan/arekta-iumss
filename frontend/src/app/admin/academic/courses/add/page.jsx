"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { CourseForm } from "@/components/forms/course-form"
import { toast } from "sonner"

export default function AddCoursePage() {
  const router = useRouter()

  const handleSubmit = async (data) => {
    try {
      toast.success("Course created successfully")
      router.push("/admin/academic/courses")
    } catch (error) {
      toast.error("Failed to create course")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Course"
        description="Create a new academic course in the system"
      />

      <div className="mx-auto max-w-3xl">
        <CourseForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 