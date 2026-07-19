// zenvy/frontend/src/utils/api.js

// Fallback to localhost if the environment variable isn't loaded yet
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // Set default headers for JSON handling
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error;
  }
};
