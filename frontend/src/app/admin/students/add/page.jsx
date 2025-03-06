"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { StudentForm } from "@/components/forms/student-form"
import { toast } from "sonner"

export default function AddStudentPage() {
  const router = useRouter()

  const handleSubmit = async (data) => {
    try {
      toast.success("Student created successfully")
      router.push("/admin/students")
    } catch (error) {
      toast.error("Failed to create student")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Student"
        description="Create a new student account in the system"
      />

      <div className="mx-auto max-w-3xl">
        <StudentForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
} 