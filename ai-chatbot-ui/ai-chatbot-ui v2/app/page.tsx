"use client"

import { useState } from "react"
import ChatInterface from "@/components/chat-interface"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ fileId: string; name: string } | null>(null)

  const handleLogin = (fileId: string, name: string) => {
    setUserInfo({ fileId, name })
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return <SplashScreen onLogin={handleLogin} />
  }

  return <ChatInterface userInfo={userInfo} />
}
