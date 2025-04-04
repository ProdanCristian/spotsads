"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/layout/logo"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"Creator" | "Advertiser" | "">("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError("There was a problem with your Google sign-in. Please try again.")
    }

    // Set userType from URL param if available
    const userTypeParam = searchParams.get("userType") as "Creator" | "Advertiser" | null
    if (userTypeParam && (userTypeParam === "Creator" || userTypeParam === "Advertiser")) {
      setUserType(userTypeParam)
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    if (!userType) {
      setError("Please select whether you're a Creator or Advertiser")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        userType: userType
      })
    } catch {
      setError("Something went wrong with Google sign-in")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-center">
        <Logo className="w-32" />
      </div>

      <div className="flex flex-col items-center gap-4 mb-2">
        <h3 className="text-lg font-medium">I am a:</h3>
        <div className="flex gap-4 w-full max-w-[320px]">
          <Button
            type="button"
            variant={userType === "Creator" ? "default" : "outline"}
            onClick={() => setUserType("Creator")}
            className={cn(
              "flex-1 h-16 text-lg transition-all",
              userType === "Creator"
                ? "shadow-lg scale-105"
                : "hover:border-primary/50"
            )}
          >
            Creator
          </Button>
          <Button
            type="button"
            variant={userType === "Advertiser" ? "default" : "outline"}
            onClick={() => setUserType("Advertiser")}
            className={cn(
              "flex-1 h-16 text-lg transition-all",
              userType === "Advertiser"
                ? "shadow-lg scale-105"
                : "hover:border-primary/50"
            )}
          >
            Advertiser
          </Button>
        </div>
      </div>

      <Card className="bg-muted shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Sign in or create an account with Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full border-2 transition-all",
                  userType ? "hover:bg-primary/10" : "opacity-70"
                )}
                onClick={handleGoogleSignIn}
                disabled={isLoading || !userType}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We&apos;ll automatically create an account if you don&apos;t have one yet
              </p>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
