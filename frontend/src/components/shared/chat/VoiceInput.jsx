"use client"

import { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'

const VoiceInput = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

          if (event.results[0].isFinal) {
            onTranscript(transcript)
            setIsListening(false)
          }
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognition)
      }
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  if (!recognition) {
    return null // Don't show button if speech recognition is not supported
  }

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isListening 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'text-gray-500 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </button>
  )
}

export default VoiceInput 