"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { FacultyForm } from "@/components/forms/faculty-form"
import { toast } from "sonner"

export default function AddFacultyPage() {
  const router = useRouter()

  const handleSubmit = async (data) => {
    try {
      toast.success("Faculty member created successfully")
      router.push("/admin/faculty")
    } catch (error) {
      toast.error("Failed to create faculty member")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Faculty"
        description="Create a new faculty member account in the system"
      />

      <div className="mx-auto max-w-3xl">
        <FacultyForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
