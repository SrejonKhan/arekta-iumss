'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/cafeteria/Header';
import CategoryFilter from '@/components/cafeteria/CategoryFilter';
import MealGrid from '@/components/cafeteria/MealGrid';
import NutritionInfo from '@/components/cafeteria/NutritionInfo';
import PreorderBenefits from '@/components/cafeteria/PreorderBenefits';
import axios from 'axios';
import { toast } from 'sonner';

const CafeteriaPage = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await axios.get('/api/v1/cafeteria');
        if (response.data.status === 'success') {
          setCafeterias(response.data.data);

          // Get all foods from all menus
          const allFoods = response.data.data.flatMap(cafeteria =>
            cafeteria.CafeteriaMenu.flatMap(menu => menu.foods)
          );
          setFoods(allFoods);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cafeteria data:', error);
        toast.error('Failed to load cafeteria data');
        setLoading(false);
      }
    };

    fetchCafeterias();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      // If no category selected, show all foods from cafeterias
      const allFoods = cafeterias.flatMap(cafeteria =>
        cafeteria.CafeteriaMenu.flatMap(menu => menu.foods)
      );
      setFoods(allFoods);
      return;
    }

    // Filter foods by selected category
    const filteredFoods = cafeterias.flatMap(cafeteria =>
      cafeteria.CafeteriaMenu.flatMap(menu =>
        menu.foods.filter(food => food.foodCategory === selectedCategory)
      )
    );
    setFoods(filteredFoods);
  }, [selectedCategory, cafeterias]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 sm:space-y-8">
          <Header cafeterias={cafeterias} />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <MealGrid foods={foods} />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NutritionInfo />
            <PreorderBenefits />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeteriaPage;
