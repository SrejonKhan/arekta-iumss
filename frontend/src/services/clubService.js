const API_BASE_URL = 'http://localhost:2222/api/v1/clubs'

export async function getAllClubs() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch clubs')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching clubs:', error)
    throw error.message || 'Failed to fetch clubs'
  }
}

export async function createClub(clubData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clubData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create club')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating club:', error)
    throw error.message || 'Failed to create club'
  }
}

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
      throw new Error(error.message || 'Failed to fetch club events')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching club events:', error)
    throw error.message || 'Failed to fetch club events'
  }
}

export async function getClubMembers(clubId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${clubId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch club members')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching club members:', error)
    throw error.message || 'Failed to fetch club members'
  }
} 