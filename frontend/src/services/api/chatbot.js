import axios from 'axios'

const CHATBOT_API = 'https://hackathon-uni-chatbot-bb0d4eb101d9.herokuapp.com/api/chat'

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(CHATBOT_API, {
      message: message
    })
    return response.data.response || 'Sorry, I could not process that request.'
  } catch (error) {
    console.error('Error sending message to chatbot:', error)
    throw new Error('Failed to get response from chatbot')
  }
}
