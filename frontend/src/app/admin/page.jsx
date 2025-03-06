'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import {
  Users,
  GraduationCap,
  Bus,
  Users2,
  Coffee,
  BookOpen,
  TrendingUp
} from 'lucide-react'

const stats = [
  {
    title: 'Total Students',
    value: '1,234',
    icon: Users,
    trend: '+5.2%',
    description: 'From last semester'
  },
  {
    title: 'Faculty Members',
    value: '89',
    icon: GraduationCap,
    trend: '+2.1%',
    description: 'From last month'
  },
  {
    title: 'Active Clubs',
    value: '24',
    icon: Users2,
    trend: '+3.1%',
    description: 'From last month'
  },
  {
    title: 'Transport Routes',
    value: '12',
    icon: Bus,
    trend: '0%',
    description: 'No change'
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{stat.trend}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Student</span>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <GraduationCap className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Faculty</span>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Course Schedule</span>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
              <Coffee className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Cafeteria Menu</span>
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              'New student registration completed',
              'Faculty meeting scheduled for next week',
              'Transport route #3 updated',
              'New club proposal received'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}