const API_BASE_URL = 'http://localhost:2222/api/v1/clubs'

export async function getClubEvents(clubId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${clubId}/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch events')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error.message || 'Failed to fetch events'
  }
}

export async function createEvent(clubId, eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${clubId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create event')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating event:', error)
    throw error.message || 'Failed to create event'
  }
}

export async function updateEvent(clubId, eventId, eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/${clubId}/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update event')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating event:', error)
    throw error.message || 'Failed to update event'
  }
}

export async function deleteEvent(clubId, eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${clubId}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete event')
    }
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error.message || 'Failed to delete event'
  }
} 