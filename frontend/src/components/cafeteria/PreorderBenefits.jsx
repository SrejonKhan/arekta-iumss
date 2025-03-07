const PreorderBenefits = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Why Preorder?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-xl">⏰</span>
            <h3 className="font-semibold text-gray-900">Skip the Queue</h3>
          </div>
          <p className="text-sm text-gray-600">
            Save time by avoiding long lines during peak hours
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-xl">💰</span>
            <h3 className="font-semibold text-gray-900">Special Discounts</h3>
          </div>
          <p className="text-sm text-gray-600">
            Get exclusive deals on preordered meals
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-blue-600 text-xl">✨</span>
            <h3 className="font-semibold text-gray-900">Fresh Preparation</h3>
          </div>
          <p className="text-sm text-gray-600">
            Ensure your meal is prepared fresh and ready on time
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreorderBenefits;
