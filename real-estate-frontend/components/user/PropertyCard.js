import Link from 'next/link';

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative h-64 w-full">
          <img
            src={property.main_image}
            alt={property.project_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ₹{Number(property.price).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {property.project_name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2">
            by <span className="font-semibold">{property.builder_name}</span>
          </p>
          
          <div className="flex items-center text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {property.location}
          </div>

          {property.description && (
            <p className="mt-3 text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
