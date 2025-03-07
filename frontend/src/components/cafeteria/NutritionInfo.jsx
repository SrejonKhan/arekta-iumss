const NutritionInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
        Nutrition Information
      </h2>
      <p className="text-sm sm:text-base text-gray-600">
        All our meals are prepared fresh daily. Calorie information is
        approximate. For detailed nutritional information and allergen details,
        please click on specific items.
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>View complete nutrition guide</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionInfo;
