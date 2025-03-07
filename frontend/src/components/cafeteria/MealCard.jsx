const MealCard = ({ meal }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {meal.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {meal.description}
            </p>
          </div>
          <span className="text-3xl sm:text-4xl">{meal.image}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {meal.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {meal.calories}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {meal.time}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            {meal.price}
          </span>
          <button
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            active:bg-blue-800 transition-colors"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
