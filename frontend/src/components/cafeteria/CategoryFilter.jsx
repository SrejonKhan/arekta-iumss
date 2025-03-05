"use client"

const CategoryFilter = () => {
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 whitespace-nowrap"
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter 