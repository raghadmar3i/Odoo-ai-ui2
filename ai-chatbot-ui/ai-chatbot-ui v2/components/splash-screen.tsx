"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SplashScreenProps {
  onLogin: (fileId: string, name: string) => void
}

export default function SplashScreen({ onLogin }: SplashScreenProps) {
  const [error, setError] = useState<string | null>(null)

  const [fileId, setFileId] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileId.trim() || !name.trim()) return
  
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("https://rcc-ai.digital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important if the server sets a session cookie
        body: JSON.stringify({ fileId: fileId.trim(), name: name.trim() }),
      })
  
      if (!res.ok) {
        // you can refine this with res.status and a switch, if you like
        const msg = await res.text().catch(() => "")
        throw new Error(msg || `Login failed (HTTP ${res.status})`)
      }
  
      // If your API returns user info, you could read it here:
      // const data = await res.json()
      // onLogin(data.fileId, data.name)
  
      // For now, pass the form values upward:
      onLogin(fileId.trim(), name.trim())
    } catch (err: any) {
      setError(err.message || "Could not log in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  

    setIsLoading(true)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onLogin(fileId.trim(), name.trim())
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-splash-gradient-from)] to-[var(--color-splash-gradient-to)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Chat Assistant</h1>
          {error && (
            <div className="text-sm text-red-600 bg-white/70 border border-red-200 rounded p-2 mb-2">
              {error}
            </div>
          )}

          <p className="text-white/80 text-sm">ERP Integration Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fileId" className="text-white font-medium">
                File ID
              </Label>
              <Input
                id="fileId"
                type="text"
                placeholder="Enter your File ID"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                className="bg-white/90 border-white/30 text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/90 border-white/30 text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading || !fileId.trim() || !name.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                "Access Chat"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-xs">Secure ERP Integration • AI-Powered Assistance</p>
        </div>
      </div>
    </div>
  )
}
