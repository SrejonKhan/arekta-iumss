import React from "react";
import Header from '@/components/cafeteria/Header'
import CategoryFilter from '@/components/cafeteria/CategoryFilter'
import MealGrid from '@/components/cafeteria/MealGrid'
import NutritionInfo from '@/components/cafeteria/NutritionInfo'
import PreorderBenefits from '@/components/cafeteria/PreorderBenefits'

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
      image: "🍳"
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
      image: "🍗"
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
      image: "🍝"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <CategoryFilter />
      <MealGrid meals={meals} />
      <NutritionInfo />
      <PreorderBenefits />
    </div>
  );
};

export default page;
