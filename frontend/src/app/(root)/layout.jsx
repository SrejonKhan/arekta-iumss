import React from "react";

const RootLayout = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
