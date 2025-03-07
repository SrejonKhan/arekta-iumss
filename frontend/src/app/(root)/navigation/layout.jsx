"use client";

const NavigationLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-4">
        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default NavigationLayout;
