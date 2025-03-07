"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { ClubForm } from "@/components/forms/club-form"
import { toast } from "sonner"
import { createClub } from "@/services/clubService"

export default function AddClubPage() {
  const router = useRouter()

  const handleSubmit = async (data) => {
    try {
      await createClub(data)
      toast.success("Club created successfully")
      router.push("/admin/clubs")
    } catch (error) {
      console.error('Error in club creation:', error)
      toast.error(error || "Failed to create club")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Club"
        description="Create a new student club in the system"
      />

      <div className="mx-auto max-w-3xl">
        <ClubForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}