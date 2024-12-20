export const loginUser = async (username, password) => {
  // Construct the URL with proper encoding for username and password
  const API_URL = `http://localhost:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  try {
    const response = await fetch(API_URL, {
      method: 'GET', // Since the backend is expecting query params
    });

    // Handle non-200 HTTP responses
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON from response
    console.log('Response Data:', data); // Log the response data for debugging

    return data; // Return parsed data (even if data.ok is false)
  } catch (error) {
    console.error('Error Message:', error.message); // Log error message
    throw new Error(error.message || 'Failed to connect to the server');
  }
};

