import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    is_authenticated: false,
    username: "",
    is_superuser: false,
    is_staff: false,
    role:'',
  });

  const [showlogin, setshowlogin] = useState(null);
  const [showpayment, setshowpayment] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const access_token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const is_superuser = localStorage.getItem("is_superuser") === "true";
    const is_staff = localStorage.getItem("is_staff") === "true";
    const role = localStorage.getItem("role");

    if (access_token && username) {
      setUser({
        is_authenticated: true,
        username,
        is_superuser,
        is_staff,
        role,
      });

      // Set axios Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        setshowlogin,
        showlogin,
        showpayment,
        setshowpayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
