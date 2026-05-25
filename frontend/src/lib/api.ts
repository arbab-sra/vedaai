const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  return url.replace(/\/+$/, '');
};

export const api = {
  getAssignments: async () => {
    const res = await fetch(`${getBaseUrl()}/api/assignments`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },

  getAssignmentById: async (id: string) => {
    const res = await fetch(`${getBaseUrl()}/api/assignments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch assignment');
    return res.json();
  },

  createAssignment: async (formData: FormData) => {
    const res = await fetch(`${getBaseUrl()}/api/assignments`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to create assignment');
    return res.json();
  },

  deleteAssignment: async (id: string) => {
    const res = await fetch(`${getBaseUrl()}/api/assignments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete assignment');
    return res.json();
  },

  createProfile: async (data: { fullName: string; organizationName: string; occupation: string }) => {
    const res = await fetch(`${getBaseUrl()}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create profile');
    return res.json();
  },
};
