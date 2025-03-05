import StudentInfo from '@/components/home/StudentInfo'
import UpcomingEvents from '@/components/home/UpcomingEvents'
import QuickAccess from '@/components/home/QuickAccess'

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
      required: 160
    },
    academicStatus: "Regular",
    advisor: "Dr. Sarah Johnson"
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
        syllabus: "Chapter 1-5"
      },
      {
        course: "CSE 3101",
        title: "Operating Systems",
        date: "2024-03-18",
        time: "2:00 PM",
        venue: "Room 402",
        type: "Quiz 2",
        syllabus: "Process Management"
      }
    ],
    assignments: [
      {
        course: "CSE 3102",
        title: "Network Programming",
        deadline: "2024-03-10",
        status: "Pending",
        progress: 60,
        type: "Project"
      },
      {
        course: "CSE 3103",
        title: "Software Engineering Report",
        deadline: "2024-03-12",
        status: "Pending",
        progress: 30,
        type: "Assignment"
      },
      {
        course: "CSE 3104",
        title: "AI Lab Report",
        deadline: "2024-03-14",
        status: "Draft Submitted",
        progress: 80,
        type: "Lab Report"
      }
    ]
  };

  const features = [
    {
      title: "Cafeteria Menu & Meal Schedules",
      description: "Pre-order meals, view nutrition info, and get real-time updates on today's specials",
      icon: "🍽️",
      href: "/cafeteria",
      color: "bg-orange-50"
    },
    {
      title: "University Bus Routes",
      description: "Real-time bus tracking and schedule updates",
      icon: "🚌",
      href: "/transport"
    },
    {
      title: "Class Schedules",
      description: "View your class routines and faculty contacts",
      icon: "📚",
      href: "/schedule"
    },
    {
      title: "Events & Clubs",
      description: "Stay updated with university events and club activities",
      icon: "🎭",
      href: "/events"
    },
    {
      title: "Campus Navigation",
      description: "AR-enabled campus navigation and mapping",
      icon: "🗺️",
      href: "/navigation"
    }
  ];

  return (
    <div className="min-h-screen">
      <StudentInfo studentInfo={studentInfo} />
      <UpcomingEvents 
        exams={upcomingEvents.exams} 
        assignments={upcomingEvents.assignments} 
      />
      <QuickAccess features={features} />
    </div>
  );
}
