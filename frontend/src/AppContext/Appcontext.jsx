import { createContext, useState, useEffect } from "react";
import { session, SESSION_EXPIRED_EVENT } from "../api";

export const AppContext = createContext();

const EMPTY_USER = {
  is_authenticated: false,
  username: "",
  is_superuser: false,
  is_staff: false,
  role: "",
};

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(EMPTY_USER);

  const [showlogin, setshowlogin] = useState(null);
  const [resetpassword, setresetpassword] = useState(null);

  useEffect(() => {
    // Restore the session from storage. The API client reads the token itself,
    // so there is no axios default header to set here any more.
    setUser(session.getUser());

    // When a refresh token finally expires, `api/client.js` clears storage and
    // fires this event: drop the user and open the login modal.
    const handleExpired = () => {
      setUser(EMPTY_USER);
      setshowlogin(true);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        setshowlogin,
        showlogin,
        resetpassword,
        setresetpassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
