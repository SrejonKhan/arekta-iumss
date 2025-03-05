"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import ChatButton from './ChatButton'
import ChatWindow from './ChatWindow'
import { sendMessage } from '@/services/api/chatbot'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your IUMSS assistant. How can I help you today?",
      isBot: true
    }
  ])

  const handleSendMessage = async (message) => {
    try {
      // Add user message immediately
      setMessages(prev => [...prev, { text: message, isBot: false }])
      
      // Show loading state
      setIsLoading(true)

      // Get response from API
      const botResponse = await sendMessage(message)
      
      // Add bot response
      setMessages(prev => [...prev, { 
        text: botResponse,
        isBot: true 
      }])

    } catch (error) {
      toast.error("Sorry, I'm having trouble responding right now.")
      console.error('Chatbot error:', error)
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isBot: true 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ChatButton onClick={() => setIsOpen(true)} />
      {isOpen && (
        <ChatWindow
          messages={messages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default Chatbot 