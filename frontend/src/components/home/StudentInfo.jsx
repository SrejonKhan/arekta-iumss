"use client";

import { GraduationCap, BookOpen, Award } from "lucide-react";

const StudentInfo = ({ studentInfo }) => {
  return (
    <section className="bg-white border rounded-lg shadow-sm h-full">
      <div className="p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {studentInfo.name}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              ID: {studentInfo.id}
            </p>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">
            Academic Information
          </h3>
          <div className="grid gap-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Department:</span>{" "}
              {studentInfo.department}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Program:</span>{" "}
              {studentInfo.program}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current Semester:</span>{" "}
              {studentInfo.currentSemester}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Level-Term:</span>{" "}
              {studentInfo.levelTerm}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Academic Advisor:</span>{" "}
              {studentInfo.advisor}
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Performance</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                CGPA: <span className="font-semibold">{studentInfo.cgpa}</span>
              </p>
              <p className="text-gray-700">
                Semesters:{" "}
                <span className="font-semibold">
                  {studentInfo.enrolledSemesters}
                </span>
              </p>
              <p className="text-gray-700">
                Status:{" "}
                <span className="font-semibold">
                  {studentInfo.academicStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Credits</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                Completed:{" "}
                <span className="font-semibold">
                  {studentInfo.credits.completed}
                </span>
              </p>
              <p className="text-gray-700">
                Ongoing:{" "}
                <span className="font-semibold">
                  {studentInfo.credits.ongoing}
                </span>
              </p>
              <p className="text-gray-700">
                Required:{" "}
                <span className="font-semibold">
                  {studentInfo.credits.required}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-blue-600">Credit Completion</span>
            <span className="font-medium text-blue-600">
              {Math.round(
                (studentInfo.credits.completed / studentInfo.credits.required) *
                  100
              )}
              %
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${
                  (studentInfo.credits.completed /
                    studentInfo.credits.required) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentInfo;
