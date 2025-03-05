const MealCard = ({ meal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{meal.description}</p>
            <p className="text-sm text-gray-500">{meal.calories}</p>
          </div>
          <span className="text-4xl">{meal.image}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg">{meal.price}</span>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Order Now
          </button>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            Available: {meal.time}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MealCard 