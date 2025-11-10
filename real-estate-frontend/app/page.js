'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/user/PropertyCard';
import SearchFilter from '@/components/user/SearchFilter';
import { getAllProperties } from '@/lib/api';

export default function HomePage() {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const data = await getAllProperties();
    setAllProperties(data);
    setFilteredProperties(data);
    setLoading(false);
  };

  const handleFilter = (filters) => {
    let filtered = [...allProperties];

    if (filters.search) {
      filtered = filtered.filter((property) =>
        property.project_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (property) => Number(property.price) >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (property) => Number(property.price) <= Number(filters.maxPrice)
      );
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real Estate Listings</h1>
              <p className="text-gray-600 mt-1">Find your dream property</p>
            </div>
            <Link
              href="/admin"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilter onFilter={handleFilter} />

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading properties...</p>
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
          </div>
        )}

        {!loading && filteredProperties.length > 0 && (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Real Estate Listings. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
