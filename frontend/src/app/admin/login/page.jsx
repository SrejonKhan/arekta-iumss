"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Login() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to admin dashboard since no login is required
        router.push("/admin")
    }, [router])

    return null
}
