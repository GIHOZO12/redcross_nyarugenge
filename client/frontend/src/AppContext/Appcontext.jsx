import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

// eslint-disable-next-line react/prop-types
const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    is_authenticated: false,
    username: "",
    is_superuser: false,
    is_staff: false,
  });
  const [showlogin, setshowlogin] = useState(null);
  const [showpayment, setshowpayment] = useState(null);

  // Function to check if the user is authenticated
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token found.");
      return null;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });
      const data = await response.json();
      if (data.access) {
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        console.error("Failed to refresh token:", data);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };
  
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setUser({
        is_authenticated: false,
        username: "",
        is_superuser: false,
        is_staff: false,
      });
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/check_auth/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 401) {
        // Token is expired, try refreshing it
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          // Retry the request with the new token
          const retryResponse = await fetch("http://127.0.0.1:8000/check_auth/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          const retryData = await retryResponse.json();
          if (retryData.is_authenticated) {
            setUser({
              is_authenticated: true,
              username: retryData.user.username,
              is_superuser: retryData.user.is_superuser,
              is_staff: retryData.user.is_staff,
            });
          } else {
            setUser({
              is_authenticated: true,
              username: "",
              is_superuser: false,
              is_staff: false,
            });
          }
        } else {
          setUser({
            is_authenticated: false,
            username: "",
            is_superuser: false,
            is_staff: false,
          });
        }
      } else {
        const data = await response.json();
        if (data.is_authenticated) {
          setUser({
            is_authenticated: true,
            username: data.user.username,
            is_superuser: data.user.is_superuser,
            is_staff: data.user.is_staff,
          });
        } else {
          setUser({
            is_authenticated: false,
            username: "",
            is_superuser: false,
            is_staff: false,
          });
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUser({
        is_authenticated: false,
        username: "",
        is_superuser: false,
        is_staff: false,
      });
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, checkAuth,setshowlogin,showlogin,showpayment,setshowpayment }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;