"use client"
import { LoginForm } from "@/components/auth/login-form"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated" && session) {
            router.push("/dashboard")
        }
    }, [session, status, router])

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <LoginForm />
            </div>
        </div>
    )
} 