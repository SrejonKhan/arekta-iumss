import React from 'react';

const MealCard = ({ food }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{food.foodName}</h3>
        <p className="text-sm text-gray-600 mt-1">{food.foodCategory}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-primary">৳{food.foodPrice}</span>
          <span className={`px-2 py-1 rounded text-sm ${food.foodType === 'VEG'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {food.foodType}
          </span>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Calories:</span>
            <span>{food.calories} cal</span>
          </div>
          <div className="flex justify-between">
            <span>Protein:</span>
            <span>{food.protein}g</span>
          </div>
          <div className="flex justify-between">
            <span>Fat:</span>
            <span>{food.fat}g</span>
          </div>
          <div className="flex justify-between">
            <span>Carbs:</span>
            <span>{food.carbs}g</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50">
        <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
          Add to Order
        </button>
      </div>
    </div>
  );
};

export default MealCard;
