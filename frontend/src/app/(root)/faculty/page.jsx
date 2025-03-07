"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, GraduationCap, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FacultiesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Organized by department for better grouping
  const departments = {
    "Computer Science": [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        position: "Associate Professor",
        email: "sarah.johnson@university.edu",
        office: "CS Building, Room 401",
        officeHours: "Mon, Wed 2-4 PM",
      },
      {
        id: 2,
        name: "Dr. James Lee",
        position: "Assistant Professor",
        email: "j.lee@university.edu",
        office: "CS Building, Room 405",
        officeHours: "Tue, Thu 1-3 PM",
      },
    ],
    Mathematics: [
      {
        id: 3,
        name: "Prof. Michael Chen",
        position: "Professor",
        email: "m.chen@university.edu",
        office: "Math Building, Room 302",
        officeHours: "Tue, Thu 1-3 PM",
      },
      {
        id: 4,
        name: "Dr. Lisa Wang",
        position: "Associate Professor",
        email: "l.wang@university.edu",
        office: "Math Building, Room 304",
        officeHours: "Mon, Wed 10-12 PM",
      },
    ],
    Physics: [
      {
        id: 5,
        name: "Dr. Emily Brown",
        position: "Professor",
        email: "emily.brown@university.edu",
        office: "Physics Building, Room 205",
        officeHours: "Mon, Fri 10-12 PM",
      },
      {
        id: 6,
        name: "Dr. Robert Wilson",
        position: "Assistant Professor",
        email: "r.wilson@university.edu",
        office: "Physics Building, Room 207",
        officeHours: "Wed, Fri 2-4 PM",
      },
    ],
    "Electrical Engineering": [
      {
        id: 7,
        name: "Prof. David Miller",
        position: "Professor",
        email: "d.miller@university.edu",
        office: "Engineering Building, Room 503",
        officeHours: "Wed, Fri 3-5 PM",
      },
      {
        id: 8,
        name: "Dr. Anna Martinez",
        position: "Associate Professor",
        email: "a.martinez@university.edu",
        office: "Engineering Building, Room 505",
        officeHours: "Tue, Thu 2-4 PM",
      },
    ],
  };

  // Filter departments based on selection
  const filteredDepartments =
    selectedDepartment === "all"
      ? departments
      : { [selectedDepartment]: departments[selectedDepartment] };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Faculty Directory
      </h1>

      {/* Department Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
        <Button
          onClick={() => setSelectedDepartment("all")}
          className={`${
            selectedDepartment === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          } transition-colors duration-200 text-sm sm:text-base py-1 px-3 sm:py-2 sm:px-4`}
        >
          All Departments
        </Button>
        {Object.keys(departments).map((dept) => (
          <Button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`${
              selectedDepartment === dept
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            } transition-colors duration-200 text-sm sm:text-base py-1 px-3 sm:py-2 sm:px-4`}
          >
            {dept}
          </Button>
        ))}
      </div>

      <div className="space-y-6 sm:space-y-8">
        {Object.entries(filteredDepartments).map(([department, faculty]) => (
          <div
            key={department}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
                {department}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {faculty.map((member) => (
                <Card
                  key={member.id}
                  className="bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                            {member.name}
                          </h3>
                          <div className="flex items-center text-blue-600 mt-1">
                            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">
                              {member.position}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-400" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs sm:text-sm hover:text-blue-600 transition-colors break-all"
                        >
                          {member.email}
                        </a>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {member.office}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Office Hours:</span>{" "}
                          {member.officeHours}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
