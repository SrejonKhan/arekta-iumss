"use client"

import { GraduationCap, BookOpen, Award } from 'lucide-react'

const StudentInfo = ({ studentInfo }) => {
  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
                <p className="text-gray-600">ID: {studentInfo.id}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Department:</span> {studentInfo.department}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Program:</span> {studentInfo.program}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Academic Advisor:</span> {studentInfo.advisor}
              </p>
            </div>
          </div>

          {/* Middle Column - Academic Status */}
          <div className="flex-1">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Current Academic Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Semester</span>
                  <span className="font-medium">{studentInfo.currentSemester}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Level-Term</span>
                  <span className="font-medium">{studentInfo.levelTerm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrolled Semesters</span>
                  <span className="font-medium">{studentInfo.enrolledSemesters}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CGPA</span>
                  <span className="font-medium">{studentInfo.cgpa}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Credit Status */}
          <div className="flex-1">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Credit Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed Credits</span>
                    <span className="font-medium">{studentInfo.credits.completed}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(studentInfo.credits.completed / studentInfo.credits.required) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ongoing Credits</span>
                    <span className="font-medium">{studentInfo.credits.ongoing}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(studentInfo.credits.ongoing / studentInfo.credits.required) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm">Required Credits</span>
                    <span className="font-medium">{studentInfo.credits.required}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentInfo 