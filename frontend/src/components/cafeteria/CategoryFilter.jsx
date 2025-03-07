"use client";

const CategoryFilter = () => {
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="relative">
      <div className="flex gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 hover:bg-gray-200 
              text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 
              whitespace-nowrap transition-colors focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2 active:bg-gray-300"
          >
            {category}
          </button>
        ))}
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-4 pointer-events-none bg-gradient-to-t from-white to-transparent sm:hidden" />
    </div>
  );
};

export default CategoryFilter;
