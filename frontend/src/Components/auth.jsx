// auth.js

// Function to refresh the access token
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');  // Retrieve the refresh token
    if (!refreshToken) {
      console.error('No refresh token found. Please log in again.');
      return null;
    }
  
    try {
      const response = await fetch('https://gihozo.pythonanywhere.com/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);  // Store the new access token
        return data.access;  // Return the new access token
      } else {
        console.error('Failed to refresh token');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };
  
  // Function to check if the token is expired
  export const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));  // Decode the token payload
      return payload.exp * 1000 < Date.now();  // Check if the token is expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;  // Assume the token is expired if there's an error
    }
  };