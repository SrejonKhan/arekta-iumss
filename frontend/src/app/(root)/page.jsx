import StudentInfo from "@/components/home/StudentInfo";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import QuickAccess from "@/components/home/QuickAccess";

export default function Home() {
  // Mock student data
  const studentInfo = {
    name: "John Doe",
    id: "2020331001",
    department: "Computer Science & Engineering",
    program: "BSc in CSE",
    currentSemester: "Fall 2023",
    levelTerm: "Level-3, Term-1",
    enrolledSemesters: 5,
    cgpa: "3.85",
    credits: {
      completed: 85,
      ongoing: 21,
      required: 160,
    },
    academicStatus: "Regular",
    advisor: "Dr. Sarah Johnson",
  };

  // Upcoming events data
  const upcomingEvents = {
    exams: [
      {
        course: "CSE 3100",
        title: "Database Management",
        date: "2024-03-15",
        time: "10:00 AM",
        venue: "Room 301",
        type: "Mid Term",
        syllabus: "Chapter 1-5",
      },
      {
        course: "CSE 3101",
        title: "Operating Systems",
        date: "2024-03-18",
        time: "2:00 PM",
        venue: "Room 402",
        type: "Quiz 2",
        syllabus: "Process Management",
      },
    ],
    assignments: [
      {
        course: "CSE 3102",
        title: "Network Programming",
        deadline: "2024-03-10",
        status: "Pending",
        progress: 60,
        type: "Project",
      },
      {
        course: "CSE 3103",
        title: "Software Engineering Report",
        deadline: "2024-03-12",
        status: "Pending",
        progress: 30,
        type: "Assignment",
      },
      {
        course: "CSE 3104",
        title: "AI Lab Report",
        deadline: "2024-03-14",
        status: "Draft Submitted",
        progress: 80,
        type: "Lab Report",
      },
    ],
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6">
          <StudentInfo studentInfo={studentInfo} />
          <UpcomingEvents
            exams={upcomingEvents.exams}
            assignments={upcomingEvents.assignments}
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
              exams={upcomingEvents.exams}
              assignments={upcomingEvents.assignments}
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
