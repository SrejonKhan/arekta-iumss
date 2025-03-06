import axios from 'axios'

const allCourseURL = 'https://schedule-generator-7df2e7322141.herokuapp.com/api/courses'

export const getAllCourses = async () => {
    try {
        const response = await axios.get(allCourseURL)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
}

export const getCoursesBySemester = async (semesterName) => {
    try {
        const response = await axios.get(`${allCourseURL}/${semesterName}`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
}
