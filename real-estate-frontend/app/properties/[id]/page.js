import Link from 'next/link';
import { getPropertyById } from '@/lib/api';
import ImageGallery from '@/components/user/ImageGallery';

export default async function PropertyDetailPage({ params }) {
  const { id } = await params; 
  const property = await getPropertyById(id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Link href="/" className="text-indigo-600 hover:underline">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Listings
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <ImageGallery
                mainImage={property.main_image}
                images={property.gallery_images || []}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.project_name}
              </h1>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-32 text-gray-600 font-medium">Builder:</div>
                  <div className="flex-1 text-gray-900">{property.builder_name}</div>
                </div>

                <div className="flex items-start">
                  <div className="w-32 text-gray-600 font-medium">Location:</div>
                  <div className="flex-1 text-gray-900 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property.location}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-32 text-gray-600 font-medium">Price:</div>
                  <div className="flex-1">
                    <span className="text-3xl font-bold text-indigo-600">
                      ₹{Number(property.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <hr className="my-6" />

                {property.description && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
