import axios from "axios";

const BASE_URL = "https://schedule-generator-7df2e7322141.herokuapp.com/api/routines";

// Get semester wise routine
const getSemesterWiseRoutine = async (semesterName) => {
    try {
        const response = await axios.get(`${BASE_URL}/${encodeURIComponent(semesterName)}`, {
            params: {
                version: 'latest',
                generate: false
            }
        });
        return response.data.routine;
    } catch (error) {
        throw new Error(`Failed to fetch routine: ${error.message}`);
    }
};

// Post semester wise routine (generate new routine)
const postSemesterWiseRoutine = async (semesterName) => {
    try {
        const response = await axios.post(`${BASE_URL}/${encodeURIComponent(semesterName)}`);
        return response.data.routine;
    } catch (error) {
        throw new Error(`Failed to generate routine: ${error.message}`);
    }
};

// Available semester choices
export const SEMESTER_CHOICES = {
    FIRST_SEMESTER: "First Semester",
    SECOND_SEMESTER: "Second Semester",
    THIRD_SEMESTER: "Third Semester",
    FOURTH_SEMESTER: "Fourth Semester",
    FIFTH_SEMESTER: "Fifth Semester",
    SIXTH_SEMESTER: "Sixth Semester",
    SEVENTH_SEMESTER: "Seventh Semester",
    EIGHTH_SEMESTER: "Eighth Semester",
};

export {
    getSemesterWiseRoutine,
    postSemesterWiseRoutine
};

