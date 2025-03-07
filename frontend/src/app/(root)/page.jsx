"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentInfo from "@/components/home/StudentInfo";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import QuickAccess from "@/components/home/QuickAccess";
import { getStudentProfile, getStudentAcademics } from "@/services/studentService";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [studentInfo, setStudentInfo] = useState(null)
  const [academicInfo, setAcademicInfo] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!token || user.role !== 'STUDENT') {
      router.push('/login')
      return
    }

    fetchStudentData()
  }, [router])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Since we already have the user data from login, we can use it directly
      const profile = user
      const academics = user.userProfile

      setStudentInfo({
        name: profile.displayName,
        id: profile.id,
        department: academics.department,
        program: `${academics.department} Engineering`, // Assuming it's engineering
        currentSemester: academics.currentSemester,
        levelTerm: `Level-${academics.levelTerm}`,
        enrolledSemesters: parseInt(academics.currentSemester),
        cgpa: academics.currentCgpa,
        credits: {
          completed: academics.completedCredit,
          ongoing: academics.ongoingCredit,
          required: academics.requiredCredit,
        },
        academicStatus: "Regular", // This could be derived from other data if available
        advisor: "Not Assigned", // This could be added when available from API
      })

      // For now, we'll use empty arrays since we don't have this data yet
      setAcademicInfo({
        upcomingExams: [],
        pendingAssignments: []
      })
    } catch (error) {
      toast.error("Failed to load student data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      title: "Cafeteria Menu & Meal Schedules",
      description:
        "Pre-order meals, view nutrition info, and get real-time updates on today's specials",
      icon: "🍽️",
      href: "/cafeteria",
      color: "bg-orange-50",
    },
    {
      title: "University Bus Routes",
      description: "Real-time bus tracking and schedule updates",
      icon: "🚌",
      href: "/transport",
    },
    {
      title: "Class Schedules",
      description: "View your class routines and faculty contacts",
      icon: "📚",
      href: "/schedule",
    },
    {
      title: "Events & Clubs",
      description: "Stay updated with university events and club activities",
      icon: "🎭",
      href: "/events",
    },
    {
      title: "Campus Navigation",
      description: "AR-enabled campus navigation and mapping",
      icon: "🗺️",
      href: "/navigation",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6">
          <StudentInfo studentInfo={studentInfo} />
          <UpcomingEvents
            exams={academicInfo?.upcomingExams || []}
            assignments={academicInfo?.pendingAssignments || []}
          />
          <QuickAccess features={features} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1">
            <StudentInfo studentInfo={studentInfo} />
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            <UpcomingEvents
              exams={academicInfo?.upcomingExams || []}
              assignments={academicInfo?.pendingAssignments || []}
            />
            <QuickAccess features={features.slice(0, 3)} />
          </div>

          {/* Bottom Row - Full Width */}
          <div className="col-span-3 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-center">
                More Campus Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {features.slice(3).map((feature, index) => (
                  <a
                    key={index + 3}
                    href={feature.href}
                    className={`flex flex-col items-center p-4 rounded-lg ${
                      feature.color || "bg-blue-50"
                    } hover:shadow-md transition-all duration-300 group`}
                  >
                    <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </span>
                    <h3 className="text-base font-semibold text-center">
                      {feature.title}
                    </h3>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
