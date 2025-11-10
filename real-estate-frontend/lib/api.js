const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllProperties = async () => {
  try {
    const res = await fetch(`${API_URL}/properties`, {
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Failed to fetch properties');
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error('Failed to fetch property');
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const createProperty = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      body: formData 
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create property');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id, formData) => {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update property');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const res = await fetch(`${API_URL}/properties/${id}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete property');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};
