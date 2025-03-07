const API_BASE_URL = 'http://localhost:2222/api/v1'

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

export async function getStudentProfile() {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}/students/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch student profile')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching student profile:', error)
    throw error
  }
}

export async function getStudentAcademics() {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}/students/academics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch academic info')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching academic info:', error)
    throw error
  }
} 