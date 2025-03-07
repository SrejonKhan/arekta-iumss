"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { StudentForm } from "@/components/forms/student-form"
import { toast } from "sonner"
import { createUser } from "@/services/userService"

export default function AddStudentPage() {
  const router = useRouter()

  const handleSubmit = async (data) => {
    try {
      await createUser(data, 'STUDENT')
      toast.success("Student created successfully")
      router.push("/admin/students")
    } catch (error) {
      console.error('Error in student creation:', error)
      toast.error(error || "Failed to create student")
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