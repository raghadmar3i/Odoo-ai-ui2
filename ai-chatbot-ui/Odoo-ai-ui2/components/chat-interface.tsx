"use client"

import { useState, useEffect } from "react"
import { Paperclip, PlusCircle, MessageCircle, Send, Bot, User, Menu, X } from "lucide-react"

export default function ChatInterface() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [section, setSection] = useState("hr")
  const [model, setModel] = useState("Projects")
  const [loading, setLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const sections = ["hr", "projects", "accounts", "purchase"]
  const models = ["Projects", "HR", "Accounts", "Purchase", "General"]

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleQuerySubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage = { sender: "user", text: query, section, model }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const res = await fetch("https://rcc-ai.digital/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      const botMessage = {
        sender: "bot",
        text: data.response || data.error || "No response",
        raw: data,
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Error connecting to server." }])
    } finally {
      setQuery("")
      setLoading(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-2 md:p-4">
      <div className="h-full bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-[12px] shadow-2xl overflow-hidden">
        <div className="flex h-full relative">
          {!sidebarCollapsed && isMobile && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
          )}

          <aside
            className={`${sidebarCollapsed ? "w-0 -translate-x-full" : "w-48 md:w-64 translate-x-0"} ${isMobile ? "fixed left-0 top-0 h-full z-50" : "relative"} bg-gradient-to-b from-sidebar via-sidebar to-primary text-sidebar-foreground shadow-xl border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out`}
          >
            {isMobile && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="absolute top-4 right-4 p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            )}

            {/* Logo Section */}
            <div className="p-3 md:p-6 border-b border-sidebar-border/20 flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-sidebar-accent rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-sidebar-accent-foreground">🏢</span>
                </div>
                <div className="hidden md:block">
                  <h2 className="text-xl font-bold">RCC Company</h2>
                  <p className="text-sm text-sidebar-foreground/70">AI Assistant</p>
                </div>
                <div className="md:hidden">
                  <h2 className="text-sm font-bold">RCC</h2>
                </div>
              </div>
            </div>

            {/* Model Selector */}
            <div className="p-3 md:p-6 border-b border-sidebar-border/20 flex-shrink-0">
              <h3 className="font-semibold mb-3 md:mb-4 text-sidebar-foreground/90 text-sm md:text-base">
                <span className="hidden md:inline">ERP Business Modules</span>
                <span className="md:hidden">Modules</span>
              </h3>
              <div className="space-y-1 md:space-y-2">
                {models.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`w-full text-left px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 ${
                      model === m
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md transform scale-[1.02]"
                        : "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${model === m ? "bg-sidebar-accent-foreground" : "bg-sidebar-foreground/30"}`}
                      />
                      <span className="font-medium text-xs md:text-sm">{m}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spacer to push profile to bottom */}
            <div className="flex-1"></div>

            {/* User Profile */}
            <div className="p-3 md:p-6 border-t border-sidebar-border/20 flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-sidebar-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-sidebar-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0 hidden md:block">
                  <h4 className="font-semibold text-sidebar-foreground text-sm truncate">John Doe</h4>
                  <p className="text-xs text-sidebar-foreground/70 truncate">Administrator</p>
                </div>
                <button className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-sm h-full">
            <header className="h-12 md:h-16 bg-card/50 backdrop-blur-sm border-b border-border/20 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={toggleSidebar} className="p-1 hover:bg-primary/10 rounded-lg transition-colors">
                    <Menu className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </button>
                  <span className="font-semibold text-primary text-sm md:text-base">{model}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-primary/10 transition-colors text-xs md:text-sm">
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
                <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-accent/10 transition-colors text-xs md:text-sm">
                  <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages - Scrollable area */}
              <div className="flex-1 overflow-y-auto p-3 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                        Welcome to RCC AI Assistant
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Start a conversation by typing your message below.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 md:gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.sender === "bot" && (
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-card text-card-foreground border border-border rounded-bl-md"
                          }`}
                        >
                          <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                          {msg.raw?.parsed && (
                            <div className="mt-2 p-2 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground">Intent: {msg.raw.parsed.intent}</p>
                            </div>
                          )}
                        </div>
                        {msg.sender === "user" && (
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex gap-3 md:gap-4 justify-start">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-card text-card-foreground border border-border p-3 md:p-4 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-6 border-t border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
                <form onSubmit={handleQuerySubmit} className="max-w-4xl mx-auto">
                  <div className="flex gap-2 md:gap-4 items-end">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2 md:py-3 border border-border rounded-xl bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm md:text-base"
                        placeholder="Type your message..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button
                        type="button"
                        title="Coming soon"
                        className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-not-allowed text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !query.trim()}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-accent to-accent/90 text-accent-foreground rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium text-sm md:text-base"
                    >
                      <Send className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{loading ? "Sending..." : "Send"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
