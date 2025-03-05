"use client"

import { MessageCircle } from 'lucide-react'

const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  )
}

export default ChatButton 