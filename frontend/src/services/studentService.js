const API_BASE_URL = 'http://localhost:2222/api/v1/auth'

export async function getAllStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-users-by-role?role=STUDENT`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch students')
    }

    const data = await response.json()
    return data.users || []
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error.message || 'Failed to fetch students'
  }
} 