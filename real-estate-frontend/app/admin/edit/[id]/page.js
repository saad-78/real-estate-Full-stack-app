import { getPropertyById } from '@/lib/api';
import PropertyForm from '@/components/admin/PropertyForm';

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }) {
  const { id } = await params; // AWAIT params first
  const property = await getPropertyById(id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <PropertyForm property={property} />
    </div>
  );
}
