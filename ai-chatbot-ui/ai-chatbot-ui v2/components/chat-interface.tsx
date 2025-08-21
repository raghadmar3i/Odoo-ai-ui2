"use client"

import { useState, useEffect } from "react"
import { Paperclip, PlusCircle, MessageCircle, Send, Bot, User, Menu, X, Search } from "lucide-react"

interface UserInfo {
  fileId: string
  name: string
}

interface ChatInterfaceProps {
  userInfo?: UserInfo | null
}

type Sender = "user" | "bot"

interface ChatMessage {
  sender: Sender
  text: string
  section?: string
  model?: string
  raw?: any
}

interface HistoryItem {
  id: number | string
  title: string
  date?: string
  preview?: string
}

export default function ChatInterface({ userInfo }: ChatInterfaceProps) {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [section, setSection] = useState("hr")
  const [model, setModel] = useState("Projects")
  const [loading, setLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showHistoryPopup, setShowHistoryPopup] = useState(false)
  const [historySearchQuery, setHistorySearchQuery] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  const sections = ["hr", "projects", "accounts", "purchase"]
  const models = ["Projects", "HR", "Accounts", "Purchase", "General"]

  

  const filteredHistory = history.filter((h) => {
    const q = historySearchQuery.toLowerCase()
    return (h.title?.toLowerCase().includes(q) || h.preview?.toLowerCase().includes(q))
  })

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
        body: JSON.stringify({
          query,
          model,          // from state
          user: userInfo ? { name: userInfo.name, fileId: userInfo.fileId } : undefined,
        }),
      })

      const data = await res.json()
      const botMessage = {
        sender: "bot",
        text: data.response || data.error || "No response"
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

  const fetchHistory = async () => {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await fetch("https://rcc-ai.digital/history", {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // Expecting: [{ id, title, date?, preview? }, ...]
      const data = await res.json()
      setHistory(Array.isArray(data.history) ? data.history : [])
    } catch (err: any) {
      setHistoryError("Failed to load history.")
    } finally {
      setHistoryLoading(false)
    }
  }
  
  const handleHistoryClick = async () => {
    // Toggle the popup; when opening, (re)load history
    const opening = !showHistoryPopup
    setShowHistoryPopup(opening)
    if (opening) {
      await fetchHistory()
    }
  }
  
  const handleChatSelect = async (chat: HistoryItem) => {
    try {
      setLoading(true)
      // Example: GET with query param ?id=...
      const res = await fetch(`https://rcc-ai.digital/old-chat?session_id=${encodeURIComponent(String(chat.id))}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // Expecting: { messages: ChatMessage[] }
      const data = await res.json()
      if (Array.isArray(data?.messages)) {
        setMessages(data.messages as ChatMessage[])
      } else {
        // Fallback if API returns a different shape
        setMessages([])
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Could not load old chat." } as ChatMessage])
    } finally {
      setShowHistoryPopup(false)
      setLoading(false)
    }
  }
  

  return (
    <div className="h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-[var(--color-splash-gradient-from)] p-2 md:p-4">
      <div className="h-full bg-gradient-to-br from-[var(--color-splash-gradient-from)]/10 via-[var(--color-splash-gradient-to)]/10 to-[var(--color-splash-gradient-from)]/10 rounded-[12px] shadow-2xl overflow-hidden">
        <div className="flex h-full relative">
          {showHistoryPopup && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-splash-gradient-from)] to-red-700 text-white p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Chat History - {model}</h3>
                  <button
                    onClick={() => setShowHistoryPopup(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-sky-300/20">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-sky-300/20 rounded-lg bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 max-h-96">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {historySearchQuery ? "No chats found matching your search." : "No chat history available."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredHistory.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => handleChatSelect(chat)}
                          className="w-full text-left p-4 bg-white/70 hover:bg-white/90 rounded-lg border border-sky-300/20 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{chat.title}</h4>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{chat.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{chat.preview}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!sidebarCollapsed && isMobile && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
          )}

          <aside
            className={`${sidebarCollapsed ? "w-0 -translate-x-full" : "w-48 md:w-64 translate-x-0"} ${isMobile ? "fixed left-0 top-0 h-full z-50" : "relative"} bg-gradient-to-b from-[var(--color-splash-gradient-from)] via-red-700 to-blue-900 text-white shadow-xl border-r border-white/20 flex flex-col transition-all duration-300 ease-in-out`}
          >
            {isMobile && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}

            <div className="p-3 md:p-6 border-b border-white/20 flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-800 rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-white">🏢</span>
                </div>
                <div className="hidden md:block">
                  <h2 className="text-xl font-bold">RCC Company</h2>
                  <p className="text-sm text-white/70">AI Assistant</p>
                </div>
                <div className="md:hidden">
                  <h2 className="text-sm font-bold">RCC</h2>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-6 border-b border-white/20 flex-shrink-0">
              <h3 className="font-semibold mb-3 md:mb-4 text-white/90 text-sm md:text-base">
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
                        ? "bg-blue-900 text-white shadow-md transform scale-[1.02]"
                        : "hover:bg-blue-900 hover:text-white active:bg-blue-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${model === m ? "bg-white" : "bg-white/30"}`}
                      />
                      <span className="font-medium text-xs md:text-sm">{m}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="p-3 md:p-6 border-t border-white/20 flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--color-splash-gradient-from)] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 hidden md:block">
                  <h4 className="font-semibold text-white text-sm truncate">{userInfo?.name || "John Doe"}</h4>
                  <p className="text-xs text-white/70 truncate">ID: {userInfo?.fileId || "N/A"}</p>
                </div>
                <button className="text-white/70 hover:text-white transition-colors flex-shrink-0">
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

          <div className="flex-1 flex flex-col bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 backdrop-blur-sm h-full">
            <header className="h-12 md:h-16 bg-white/50 backdrop-blur-sm border-b border-sky-300/20 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={toggleSidebar} className="p-1 hover:bg-sky-500/10 rounded-lg transition-colors">
                    <Menu className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                  </button>
                  <span className="font-semibold text-sky-800 text-sm md:text-base">{model}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleHistoryClick}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-sky-500/10 transition-colors text-xs md:text-sm"
                >
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
                  <span className="hidden sm:inline">History</span>
                </button>
                <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-sky-600/10 transition-colors text-xs md:text-sm">
                  <PlusCircle className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-3 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 md:py-12">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-sky-600" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                        Welcome to RCC AI Assistant
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">
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
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-sm ${
                            msg.sender === "user"
                              ? "bg-sky-600 text-white rounded-br-md"
                              : "bg-white text-gray-800 border border-sky-300/20 rounded-bl-md"
                          }`}
                        >
                          <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                          {msg.raw?.parsed && (
                            <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                              <p className="text-xs text-gray-500">Intent: {msg.raw.parsed.intent}</p>
                            </div>
                          )}
                        </div>
                        {msg.sender === "user" && (
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {loading && (
                    <div className="flex gap-3 md:gap-4 justify-start">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <div className="bg-white text-gray-800 border border-sky-300/20 p-3 md:p-4 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 md:p-6 border-t border-sky-300/20 bg-white/50 backdrop-blur-sm flex-shrink-0">
                <form onSubmit={handleQuerySubmit} className="max-w-4xl mx-auto">
                  <div className="flex gap-2 md:gap-4 items-end">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="w-full pl-3 md:pl-4 pr-10 md:pr-12 py-2 md:py-3 border border-sky-300/20 rounded-xl bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-sm md:text-base"
                        placeholder="Type your message..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button
                        type="button"
                        title="Coming soon"
                        className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-not-allowed text-gray-400 hover:text-sky-500 transition-colors"
                      >
                        <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !query.trim()}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium text-sm md:text-base"
                    >
                      <Send className="w-3 h-3 md:w-4 md:h-4 text-white" />
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
