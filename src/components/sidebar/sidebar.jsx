import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import profileImg from "../../assets/profil/driver3.png";

const Sidebar = ({ menuOpen, toggleMenu }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLogoutClick = () => {
    console.log("Logged out");
    setDropdownOpen(false);
    navigate("/login"); // Arahkan ke halaman login
  };

  return (
    <div
    className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
        
    >
      {/* Button close (X) */}
      <button
        className="absolute top-4 right-4 text-xl sm:hidden"
        onClick={toggleMenu}
        aria-label="Close Menu"
      >
        ✕
      </button>

      {/* User Info Section */}
      <div className="flex items-center justify-between p-4 mt-12">
        <div className="flex items-center space-x-3">
          <img src={profileImg} alt="User Profile" className="w-12 h-12 rounded-full" />
          <span className="text-xl font-semibold">AZZATUL NABILA</span>
        </div>
        <button onClick={toggleDropdown} className="relative">
          <span
            className={`text-xl transform transition-transform duration-700 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Logout Section */}
      <div
        className={`mt-4 px-4 transition-all duration-700 ease-in-out overflow-hidden ${
          dropdownOpen ? "max-h-36" : "max-h-0"
        }`}
      >
        <button
          className="flex items-center w-full text-left p-2 text-gray-400 text-xl font-bold uppercase transition-colors duration-300 hover:text-white"
          onClick={handleLogoutClick}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`mt-8 space-y-4 px-4 transition-all duration-700 ease-in-out ${
          dropdownOpen ? "mt-16" : "mt-4"
        }`}
      >
        <NavLink
          to="/revenue"
          className={({ isActive }) =>
            `block w-full text-left p-4 transition-colors duration-300 ${
              isActive
                ? "text-white bg-gray-600 border-l-4 border-red-500"
                : "text-gray-400 hover:text-white hover:bg-gray-600 hover:border-l-4 hover:border-red-500"
            } text-lg uppercase border-b-[1px] border-gray-500`
          }
        >
          Revenue
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `block w-full text-left p-4 transition-colors duration-300 ${
              isActive
                ? "text-white bg-gray-600 border-l-4 border-red-500"
                : "text-gray-400 hover:text-white hover:bg-gray-600 hover:border-l-4 hover:border-red-500"
            } text-lg uppercase border-b-[1px] border-gray-500`
          }
        >
          Sales
        </NavLink>
        <NavLink
          to="/collection"
          className={({ isActive }) =>
            `block w-full text-left p-4 transition-colors duration-300 ${
              isActive
                ? "text-white bg-gray-600 border-l-4 border-red-500"
                : "text-gray-400 hover:text-white hover:bg-gray-600 hover:border-l-4 hover:border-red-500"
            } text-lg uppercase border-b-[1px] border-gray-500`
          }
        >
          Collection
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
