import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaTachometerAlt,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Navbar */}
      <div className="flex items-center justify-between h-12 bg-[#00B4D9] text-white px-4 sm:px-5 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            className="lg:hidden text-white p-2 focus:outline-none"
            onClick={toggleDropdown}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <p className="text-sm sm:text-base">Welcome {user.name}</p>
        </div>
        <button
          className="px-3 sm:px-4 py-1 bg-[#00B4D9] hover:bg-[#00B4D9] rounded text-sm sm:text-base"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Dropdown Menu (Mobile Only) */}
      <div
        className={`bg-gray-800 text-white w-full fixed top-12 left-0 ${
          isOpen ? "block" : "hidden"
        } lg:hidden z-50 max-h-[calc(100vh-3rem)] overflow-y-auto`}
      >
        <div className="px-4 py-2">
          <NavLink
            to="/employee-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            end
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={`/employee-dashboard/profile/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            end
            onClick={() => setIsOpen(false)}
          >
            <FaUsers />
            <span>My Profile</span>
          </NavLink>
          <NavLink
            to={`/employee-dashboard/leaves/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBuilding />
            <span>Leaves</span>
          </NavLink>
          <NavLink
            to={`/employee-dashboard/salary/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaCalendarAlt />
            <span>Salary</span>
          </NavLink>
          <NavLink
            to="/employee-dashboard/setting/id"
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;