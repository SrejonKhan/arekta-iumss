"use client";

import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";

const UpcomingEvents = ({ exams, assignments }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Upcoming Events
          </h2>
          <Link
            href="/schedule"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Upcoming Exams */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Exams
              </h3>
              <Link
                href="/schedule/exams"
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                All Exams
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {exams.map((exam, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        {exam.course}: {exam.title}
                      </h4>
                      <p className="text-xs text-gray-600">{exam.type}</p>
                    </div>
                    <span className="inline-flex px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium whitespace-nowrap">
                      {new Date(exam.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    {exam.time} • {exam.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Assignments
              </h3>
              <Link
                href="/assignments"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                All Tasks
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        {assignment.course}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {assignment.title}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        new Date(assignment.deadline) < new Date()
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      Due{" "}
                      {new Date(assignment.deadline).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{assignment.type}</span>
                      <span className="font-medium">
                        {assignment.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          assignment.progress < 30
                            ? "bg-red-500"
                            : assignment.progress < 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
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
  );
};

export default UpcomingEvents;
