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
        credentials: "include", // important if server sets a session cookie
        body: JSON.stringify({ fileId: fileId.trim(), name: name.trim() }),
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || `Login failed (HTTP ${res.status})`)
      }

      // You can parse response here if API returns extra info
      // const data = await res.json()
      // onLogin(data.fileId, data.name)

      onLogin(fileId.trim(), name.trim())
    } catch (err: any) {
      setError(err.message || "Could not log in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-splash-gradient-from)] to-[var(--color-splash-gradient-to)] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center"> {/* ✅ Add text-center here */}
        
        {/* Logo/Brand Section */}
        <div className="w-32 h-32 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-lg overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-28 h-28 object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">El Race AI Assistant</h1>

        {error && (
          <div className="text-sm text-red-600 bg-white/70 border border-red-200 rounded p-2 mb-2">
            {error}
          </div>
        )}
        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fileId" className="text-white font-medium">File ID</Label>
              <Input
                id="fileId"
                type="text"
                placeholder="Enter your File ID"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              disabled={isLoading || !fileId.trim() || !name.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : "Access Chat"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}