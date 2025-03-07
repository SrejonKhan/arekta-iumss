const API_BASE_URL = 'https://schedule-generator-7df2e7322141.herokuapp.com/api'

export async function getRoutineBySemester(semester) {
  try {
    // Convert semester number to semester name
    let semesterName
    switch (semester) {
      case "1":
        semesterName = "First Semester"
        break
      case "2":
        semesterName = "Second Semester"
        break
      case "3":
        semesterName = "Third Semester"
        break
      case "4":
        semesterName = "Fourth Semester"
        break
      case "5":
        semesterName = "Fifth Semester"
        break
      case "6":
        semesterName = "Sixth Semester"
        break
      case "7":
        semesterName = "Seventh Semester"
        break
      case "8":
        semesterName = "Eighth Semester"
        break
      default:
        semesterName = "First Semester"
    }

    // Add query parameters
    const queryParams = new URLSearchParams({
      version: 'latest',
      generate: 'false'
    })

    const response = await fetch(`${API_BASE_URL}/routines/${encodeURIComponent(semesterName)}?${queryParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch routine')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching routine:', error)
    throw error
  }
} 