export const API_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 
      "Content-Type": "application/json", 
      ...options.headers 
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { status: false, message: data.message || "ERROR[API FETCHING]" };
  }

  return { status: true, message: "Success", data };
};