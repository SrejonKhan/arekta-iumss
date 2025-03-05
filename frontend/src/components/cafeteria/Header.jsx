"use client"

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Today's Menu</h1>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Pre-order
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
          View Schedule
        </button>
      </div>
    </div>
  )
}

export default Header 