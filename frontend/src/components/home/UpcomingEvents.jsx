"use client"

import Link from 'next/link'
import { ArrowRight, AlertCircle, Clock, FileText } from 'lucide-react'

const UpcomingEvents = ({ exams, assignments }) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Exams */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Upcoming Exams
              </h3>
              <Link 
                href="/schedule/exams"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {exams.map((exam, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{exam.course}: {exam.title}</h4>
                      <p className="text-sm text-gray-600">{exam.type}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                      {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exam.time}
                    </span>
                    <span>{exam.venue}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Syllabus:</span> {exam.syllabus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Ongoing Assignments
              </h3>
              <Link 
                href="/assignments"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{assignment.course}</h4>
                      <p className="text-sm text-gray-600">{assignment.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(assignment.deadline) < new Date() 
                        ? 'bg-red-50 text-red-600'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      Due {new Date(assignment.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{assignment.type}</span>
                      <span className="font-medium">{assignment.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${assignment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents 