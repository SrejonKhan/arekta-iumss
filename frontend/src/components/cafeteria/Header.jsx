"use client";

import React from 'react';

const Header = ({ cafeterias = [] }) => {
  const totalFoods = cafeterias.reduce((total, cafeteria) =>
    total + cafeteria.CafeteriaMenu.reduce((menuTotal, menu) =>
      menuTotal + menu.foods.length, 0
    ), 0
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Campus Cafeterias
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cafeterias.map((cafeteria) => (
          <div key={cafeteria.id} className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg text-gray-900">
              {cafeteria.CafeteriaName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {cafeteria.CafeteriaInfo}
            </p>
            <div className="mt-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Menus:</span>
                <span>{cafeteria.CafeteriaMenu.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span>
                  {cafeteria.CafeteriaMenu.reduce((total, menu) =>
                    total + menu.foods.length, 0
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h3 className="font-semibold text-gray-900">Today's Menu</h3>
          <p className="text-sm text-gray-600">
            {totalFoods} items available across {cafeterias.length} cafeterias
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meals..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
