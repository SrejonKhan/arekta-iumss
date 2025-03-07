"use client"

import { Send } from 'lucide-react'
import { useState } from 'react'
import VoiceInput from './VoiceInput'

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSend(message)
      setMessage('')
    }
  }

  const handleVoiceTranscript = (transcript) => {
    setMessage(prev => prev + transcript)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-4">
      <VoiceInput 
        onTranscript={handleVoiceTranscript}
        disabled={isLoading}
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`p-2 bg-blue-600 text-white rounded-lg transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
        disabled={isLoading}
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  )
}

export default ChatInput 