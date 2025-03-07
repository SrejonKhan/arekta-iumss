import React from "react";
import Header from "@/components/cafeteria/Header";
import CategoryFilter from "@/components/cafeteria/CategoryFilter";
import MealGrid from "@/components/cafeteria/MealGrid";
import NutritionInfo from "@/components/cafeteria/NutritionInfo";
import PreorderBenefits from "@/components/cafeteria/PreorderBenefits";

const page = () => {
  const meals = [
    {
      id: 1,
      name: "Breakfast Combo",
      description: "Eggs, toast, fruits, and coffee",
      price: "$5.99",
      calories: "450 cal",
      available: true,
      time: "7:00 AM - 10:00 AM",
      category: "Breakfast",
      image: "🍳",
    },
    {
      id: 2,
      name: "Chicken Rice Bowl",
      description: "Grilled chicken with vegetables and rice",
      price: "$8.99",
      calories: "650 cal",
      available: true,
      time: "11:00 AM - 3:00 PM",
      category: "Lunch",
      image: "🍗",
    },
    {
      id: 3,
      name: "Vegetarian Pasta",
      description: "Fresh pasta with seasonal vegetables",
      price: "$7.99",
      calories: "550 cal",
      available: true,
      time: "11:00 AM - 8:00 PM",
      category: "All Day",
      image: "🍝",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 sm:space-y-8">
          <Header />
          <CategoryFilter />
          <MealGrid meals={meals} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NutritionInfo />
            <PreorderBenefits />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
