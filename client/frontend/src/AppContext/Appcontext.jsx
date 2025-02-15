import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const Appcontextprovider = (props) => {
  const [user, setuser] = useState({
    is_authenticated: false,
    username: "",
    is_superuser: false,
    is_staff: false,
  });
  const [showlogin, setshowlogin] = useState(null);
  const [showpayment, setshowpayment] = useState(null);

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/check_auth/", {
        credentials: "include", // Include cookies
      });
      const data = await response.json();
      if (data.is_authenticated) {
        setuser({
          is_authenticated: true,
          username: data.user.username,
          is_superuser: data.user.is_superuser,
          is_staff: data.user.is_staff,
        });
      } else {
        setuser({
          is_authenticated: false,
          username: "",
          is_superuser: false,
          is_staff: false,
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setuser({
        is_authenticated: false,
        username: "",
        is_superuser: false,
        is_staff: false,
      });
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/logout/", {
        method: "POST",
        credentials: "include", // Include cookies
      });
      const data = await response.json();
      if (data.status) {
        setuser({
          is_authenticated: false,
          username: "",
          is_superuser: false,
          is_staff: false,
        });
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Check authentication status when the app loads
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    setuser,
    showlogin,
    setshowlogin,
    showpayment,
    setshowpayment,
    checkAuth,
    logout,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default Appcontextprovider;