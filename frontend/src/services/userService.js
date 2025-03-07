const API_BASE_URL = 'http://localhost:2222/api/v1/auth'

export async function createUser(userData, role) {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        ...userData
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create user')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error.message || 'Failed to create user'
  }
} 