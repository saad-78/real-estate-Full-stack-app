import Link from 'next/link';
import { getAllProperties } from '@/lib/api';
import PropertyTable from '@/components/admin/PropertyTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const properties = await getAllProperties();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your property listings</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              View Website
            </Link>
            <Link
              href="/admin/add"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Add Property
            </Link>
          </div>
        </div>

        <PropertyTable properties={properties} />
      </div>
    </div>
  );
}
