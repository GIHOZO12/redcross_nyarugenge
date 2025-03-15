import React, { useContext, useState } from "react";
import { FaEnvelope, FaLock, FaTimes, FaUser } from "react-icons/fa";
import { AppContext } from "../AppContext/Appcontext";
import axios from "axios";
import ResetPassword from "./ResetPassword"; // Import the ResetPassword component

const Join = () => {
  const [state, setState] = useState("login"); // Tracks the form state ('login' or 'register')
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser, showlogin, setshowlogin, resetpassword, setresetpassword } =
    useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://gihozo.pythonanywhere.com/api/login/",
        {
          email,
          password,
        }
      );

      const { access, role, refresh, username, is_superuser, is_staff } =
        response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("is_superuser", is_superuser);
      localStorage.setItem("is_staff", is_staff);
      localStorage.setItem("role", role);
      console.log("Role saved to local storage:", role);

      // Set refresh_token in cookies
      document.cookie = `refresh_token=${refresh}; path=/; secure; SameSite=None`;

      // Set axios Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // Update user state
      setUser({
        is_authenticated: true,
        username: response.data.username,
        is_superuser: true,
        is_staff: true,
        role: response.data.role,
      });

      // Hide login modal
      setshowlogin(false);

      // Redirect after login
      window.location.href = "/";
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        {
          username,
          email,
          password,
        }
      );

      setMessage(response.data.message || "Registration successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      {showlogin && (
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

              {message && (
                <p className="text-red-500 text-center mb-4">{message}</p>
              )}

              {state === "login" ? (
                <>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaEnvelope className="mr-2 text-gray-500 text-xl" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 outline-none"
                      value={email}
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
                      value={password}
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
                  <a
                    href="#"
                    className="text-center text-blue-600 p-2"
                    onClick={() => setresetpassword(true)
                    }
                  >
                    Forgot password?
                  </a>
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
                      value={username}
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
                      value={email}
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
                      value={password}
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
                    Already have an account?{" "}
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
                onClick={() => setshowlogin(false)}
              />
            </form>
          </div>
        </div>
      )}

      {/* Render ResetPassword component if resetpassword is true */}
      {resetpassword && <ResetPassword />}
    </>
  );
};

export default Join;