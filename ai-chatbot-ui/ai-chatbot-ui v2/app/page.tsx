"use client"

import { useEffect, useState } from "react"
import ChatInterface from "@/components/chat-interface"
import SplashScreen from "@/components/splash-screen"

type UserInfo = { fileId: string; name: string }

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [booted, setBooted] = useState(false)

  // Restore from localStorage (optional)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rcc_user")
      if (raw) setUserInfo(JSON.parse(raw))
    } catch {}
    setBooted(true)
  }, [])

  const handleLogin = (fileId: string, name: string) => {
    const info = { fileId, name }
    setUserInfo(info)
    // Persist locally (optional; server auth still handled via cookies)
    localStorage.setItem("rcc_user", JSON.stringify(info))
  }

  if (!booted) return null // prevent hydration flicker

  if (!userInfo) {
    return <SplashScreen onLogin={handleLogin} />
  }

  return <ChatInterface userInfo={userInfo} />
}
