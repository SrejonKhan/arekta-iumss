"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, Coffee, ShoppingBag, DollarSign } from "lucide-react"

const menuColumns = [
  {
    accessorKey: "name",
    header: "Item Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span>${row.original.price}</span>
    )
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.availability === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.original.availability}
      </div>
    )
  }
]

const menuItems = [
  {
    name: "Chicken Burger",
    category: "Fast Food",
    price: "4.99",
    availability: "In Stock"
  },
  {
    name: "Vegetable Salad",
    category: "Healthy",
    price: "3.99",
    availability: "In Stock"
  }
]

const orderColumns = [
  {
    accessorKey: "orderId",
    header: "Order ID"
  },
  {
    accessorKey: "items",
    header: "Items"
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span>${row.original.total}</span>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === 'Completed' ? 'bg-green-100 text-green-800' : 
        row.original.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {row.original.status}
      </div>
    )
  }
]

const recentOrders = [
  {
    orderId: "ORD001",
    items: "2x Chicken Burger, 1x Cola",
    total: "11.97",
    status: "Completed"
  },
  {
    orderId: "ORD002",
    items: "1x Vegetable Salad, 1x Water",
    total: "5.48",
    status: "Processing"
  }
]

const stats = [
  { title: "Today's Orders", value: "45", icon: ShoppingBag },
  { title: "Total Revenue", value: "$529.99", icon: DollarSign },
  { title: "Active Menu Items", value: "24", icon: Coffee }
]

export default function CafeteriaPage() {
  const [menu] = useState(menuItems)
  const [orders] = useState(recentOrders)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cafeteria Management"
        description="Manage cafeteria menu and orders"
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Menu and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Menu Items</h2>
          <DataTable
            columns={menuColumns}
            data={menu}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <DataTable
            columns={orderColumns}
            data={orders}
          />
        </div>
      </div>
    </div>
  )
} 