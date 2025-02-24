import React, { useContext, useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaTimes, FaUser } from "react-icons/fa";
import { AppContext } from "../AppContext/Appcontext"

const Join = () => {
  const [state, setState] = useState("login"); // Tracks the form state ('login' or 'register')
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useContext(AppContext);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user_get_token/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
      });
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000//api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrfToken,
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.status) {
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        setUser({
          is_authenticated: true,
          username: data.user.username,
          is_superuser: data.user.is_superuser,
          is_staff: data.user.is_staff,
        });
        setTimeout(() => {
          window.location.href = data.redirect_url;
        },500);
    
   
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred during login");
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.status) {
        setMessage(data.message);
        setState("login"); // Switch to login form after successful registration
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred during registration");
    }
  };

  return (
    <>
      {showLogin && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div>
            <form
              onSubmit={state === "login" ? handleLogin : handleRegister}
              className="bg-white text-black p-14 relative w-[90%] top-10 max-w-md rounded-md shadow-lg"
            >
              <p className="mb-4 text-lg font-medium text-center">
                {state === "login"
                  ? "Welcome back! Please sign in to continue."
                  : "Create an account to get started!"}
              </p>

              {message && <p className="text-red-500 text-center mb-4">{message}</p>}

              {state === "login" ? (
                <>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaEnvelope className="mr-2 text-gray-500 text-xl" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaLock className="mr-2 text-gray-500 text-xl" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="flex-1 outline-none"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Login"
                      className="bg-red-500 cursor-pointer rounded-md w-full p-2 text-white hover:bg-red-600"
                    />
                  </div>
                  <a href="" className="text-center text-blue-600 p-2">Forgot password</a>
                  <p className="mt-4 text-sm text-center">
                    New to the app?{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline"
                      onClick={() => setState("register")}
                    >
                      Create one
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaUser className="mr-2 text-gray-500 text-3xl" />
                    <input
                      type="text"
                      placeholder="Username"
                      className="flex-1 outline-none"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaEnvelope className="mr-2 text-gray-500 text-xl" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaLock className="mr-2 text-gray-500 text-xl" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="flex-1 outline-none"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Register"
                      className="bg-red-500 cursor-pointer rounded-md w-full p-2 text-white hover:bg-red-600"
                    />
                  </div>
                  <p className="mt-4 text-sm text-center">
                    I already have an account?{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline"
                      onClick={() => setState("login")}
                    >
                      Login
                    </a>
                  </p>
                </>
              )}

              <FaTimes
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-lg"
                onClick={() => setShowLogin(false)}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Join;