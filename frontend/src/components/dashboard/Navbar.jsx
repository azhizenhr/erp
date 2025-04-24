import React, { useState } from 'react'
import { useAuth } from '../../context/authContext'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaRegCalendarAlt, FaTachometerAlt, FaUsers, FaBars } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai'

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex items-center h-16 bg-[#00B4D9] text-white px-5 fixed top-0 left-0 right-0 z-50 mb-6'>
     
        <div className='flex items-center w-1/3 space-x-2'>
          <img 
            src="./azhizen.png" 
            alt="Profile"
            className='w-1/3 h-10  object-cover'
          />
          <button 
            className='md:hidden text-white p-2'
            onClick={toggleDropdown}
          >
            <FaBars size={24} />
          </button>
        </div>
        {/* Welcome Text Section (1/3 width) */}
        <div className='flex items-center justify-center w-1/3'>
          <p>Welcome {user.name}</p>
        </div>
        {/* Logout Button Section (1/3 width) */}
        <div className='flex items-center justify-end w-1/3'>
          <button 
            className='px-4 py-1 bg-[#00B4D9] hover:bg-[#00B4D9] rounded'
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dropdown Menu (Mobile Only) */}
      <div className={`bg-gray-800 text-white w-full fixed top-12 left-0
        ${isOpen ? 'block' : 'hidden'} md:hidden z-50 max-h-[calc(100vh-3rem)] overflow-hidden`}>
        <div className='px-4 py-2'>
          <NavLink 
            to="/admin-dashboard"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            end
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/admin-dashboard/employees"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            end
            onClick={() => setIsOpen(false)}
          >
            <FaUsers />
            <span>Employees</span>
          </NavLink>
          <NavLink 
            to="/admin-dashboard/departments"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            onClick={() => setIsOpen(false)}
          >
            <FaBuilding />
            <span>Department</span>
          </NavLink>
          <NavLink 
            to="/admin-dashboard/leaves"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            onClick={() => setIsOpen(false)}
          >
            <FaCalendarAlt />
            <span>Leave</span>
          </NavLink>
          <NavLink 
            to="/admin-dashboard/salary/add"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            onClick={() => setIsOpen(false)}
          >
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>
          <NavLink
            to="/admin-dashboard/attendance"
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaRegCalendarAlt />
            <span>Attendance</span>
          </NavLink>
          <NavLink
            to="/admin-dashboard/attendance-report"
            className={({ isActive }) =>
              `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`
            }
            onClick={() => setIsOpen(false)}
          >
            <AiOutlineFileText />
            <span>Attendance Report</span>
          </NavLink>
          <NavLink 
            to="/admin-dashboard/setting"
            className={({ isActive }) => `${isActive ? "bg-[#00B4D9]" : ""} flex items-center space-x-4 py-2.5 px-4 rounded hover:bg-[#00B4D9] transition-colors`}
            onClick={() => setIsOpen(false)}
          >
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      {/* Overlay for mobile when dropdown is open */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Navbar