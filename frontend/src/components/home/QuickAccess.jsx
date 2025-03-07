import Link from "next/link";

const QuickAccess = ({ features }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className={`block ${
                feature.color || "bg-blue-50"
              } p-4 sm:p-6 rounded-xl hover:shadow-md transition-all duration-300 group h-full`}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 flex-grow">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
