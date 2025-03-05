const ChatMessage = ({ message, isBot }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg ${
          isBot
            ? 'bg-gray-100 text-gray-800'
            : 'bg-blue-600 text-white'
        }`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default ChatMessage 