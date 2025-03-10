import React, { useContext, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import Logo1 from '../assets/Red cross logo.jpg';
import profile_icon from "../assets/profile_icon.png";
import { AppContext } from "../AppContext/Appcontext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isFamiliesDropdownOpen, setIsFamiliesDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setshowlogin, user = {}, setUser } = useContext(AppContext);
  const { setshowpayment } = useContext(AppContext);
  const [profileImage, setProfileImage] = useState(null); // State to store profile image

  // Fetch current user data
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch("https://gihozo.pythonanywhere.com/api/current_user/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Current User Data:", data);
        setProfileImage(data.profile_image); // Set profile image
      } else {
        console.error("Failed to fetch current user");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("User is not authenticated.");
      return;
    }

    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refresh_token='))
      ?.split('=')[1];

    if (!refreshToken) {
      console.error("Refresh token is missing. Cookies:", document.cookie);
      return;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    if (!csrfToken) {
      console.error("CSRF token is missing. Cookies:", document.cookie);
      return;
    }

    try {
      const response = await fetch("https://gihozo.pythonanywhere.com/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error("Logout failed:", response.status, response.statusText);
      } else {
        console.log("Logged out successfully");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        localStorage.removeItem("is_superuser");
        localStorage.removeItem("is_staff");
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=None";
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const familiesDropdownRef = useRef(null);
  const eventDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (familiesDropdownRef.current && !familiesDropdownRef.current.contains(event.target)) {
        setIsFamiliesDropdownOpen(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target)) {
        setIsEventDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 shadow-md z-50">
      <div className="flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div>
          <Link to="/" onClick={() => navigate("/")}>
            <img src={Logo1} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-red-500 md:flex md:gap-6 md:items-center`}
        >
          <ul className="flex flex-col md:flex-row gap-6 md:gap-4 p-4 md:p-0">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <li className="text-white cursor-pointer hover:text-gray-300">
                Home
              </li>
            </Link>

            {/* Families Dropdown */}
            <li
              className="text-white relative cursor-pointer"
              ref={familiesDropdownRef}
            >
              <div
                className="flex items-center hover:text-gray-300"
                onClick={() => setIsFamiliesDropdownOpen((prev) => !prev)}
              >
                Families <FaChevronDown className="ml-1" />
              </div>

              {isFamiliesDropdownOpen && (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50"
                >
                  <Link to="/families/Humanity" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Humanity Family
                    </li>
                  </Link>
                  <Link to="/families/neutrality" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Neutrality
                    </li>
                  </Link>
                  <Link to="/families/partiarity" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Partiality
                    </li>
                  </Link>
                  <Link to="/families/unit" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Unity
                    </li>
                  </Link>
                  <Link to="/families/universality" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      Universality
                    </li>
                  </Link>
                </motion.ul>
              )}
            </li>

            {/* Events Dropdown */}
            <li
              className="text-white relative cursor-pointer"
              ref={eventDropdownRef}
            >
              <div
                className="flex items-center hover:text-gray-300"
                onClick={() => setIsEventDropdownOpen((prev) => !prev)}
              >
                Events <FaChevronDown className="ml-1" />
              </div>

              {isEventDropdownOpen && (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50"
                >
                  <Link to="/event/fellowership" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      All Fellowship
                    </li>
                  </Link>
                  <Link to="/event/allactivities" onClick={() => setIsMobileMenuOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      All Activities
                    </li>
                  </Link>
                </motion.ul>
              )}
            </li>

            <Link to="/Courses" onClick={() => setIsMobileMenuOpen(false)}>
              <li className="text-white cursor-pointer hover:text-gray-300">
                Courses
              </li>
            </Link>

            <Link to="/update" onClick={() => setIsMobileMenuOpen(false)}>
              <li className="text-white cursor-pointer hover:text-gray-300">
                Update
              </li>
            </Link>

            <Link to="/ideas" onClick={() => setIsMobileMenuOpen(false)}>
              <li className="text-white cursor-pointer hover:text-gray-300">
                Ideas Box
              </li>
            </Link>

            <Link to="" onClick={() => setshowpayment(true)}>
              <li className="text-white cursor-pointer hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
                Donate
              </li>
            </Link>

            {user.is_authenticated && (user.is_superuser || user.is_staff) && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                <li className="text-white cursor-pointer hover:text-gray-300">
                  Admin Dashboard
                </li>
              </Link>
            )}

            {user.is_authenticated && user.is_superuser && (
              <Link to={`${import.meta.env.VITE_BACKEND_URL}/admin/`} onClick={() => setIsMobileMenuOpen(false)}>
                <li className="text-white cursor-pointer hover:text-gray-300">
                  Super Admin
                </li>
              </Link>
            )}
          </ul>
        </nav>

        {/* User Profile Section */}
        {user.is_authenticated ? (
          <div className="relative group flex items-center px-4 gap-3">
            <p className="text-gray-100 max-sm:hidden">Hi, {user.username}</p>
            {profileImage ? (
              <img
                src={`https://gihozo.pythonanywhere.com${profileImage}`}
                alt="Profile"
                className="h-8 w-8 rounded-full border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profile_icon;
                }}
              />
            ) : (
              <img
                src={profile_icon}
                alt="Profile Icon"
                className="h-8 w-8 rounded-full border"
              />
            )}
            <div className="absolute hidden group-hover:block top-8 right-0 z-50 bg-black text-white rounded-md shadow-lg">
              <ul className="list-none m-0 p-2 text-sm">
                <Link to="/Viewprofile">
                  <li className="py-2 px-4 cursor-pointer hover:text-red-400">
                    View Profile
                  </li>
                </Link>
                <li
                  className="py-2 px-4 cursor-pointer hover:text-red-400"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => setshowlogin(true)}
          >
            Join Us
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;