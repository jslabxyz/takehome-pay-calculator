"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  isUser: boolean
}

interface AIChatProps {
  title: string
  context: "inputs" | "expenses" | "depreciation"
}

export function AIChat({ title, context }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hi there! I'm your AI assistant for ${title}. How can I help you today?`,
      isUser: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      let responseContent = ""

      switch (context) {
        case "inputs":
          responseContent =
            "I can help you understand the basic inputs like gross income, retirement contributions, and home office deductions. What would you like to know more about?"
          break
        case "expenses":
          responseContent =
            "I can explain which business expenses are tax deductible and how to properly document them. What specific expenses are you curious about?"
          break
        case "depreciation":
          responseContent =
            "I can help you understand how to calculate depreciation for business assets and what rates apply to different types of equipment. What would you like to know?"
          break
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
      }

      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50 p-0"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-50 w-full md:w-96 transition-all duration-300 ease-in-out",
        isExpanded ? "h-[80vh]" : "h-[400px]",
      )}
    >
      <Card className="h-full flex flex-col rounded-t-lg rounded-b-none md:rounded-tr-none md:rounded-l-lg shadow-xl border-t border-l border-r">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle className="text-base">AI Assistant: {title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-3 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.isUser ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.isUser ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
