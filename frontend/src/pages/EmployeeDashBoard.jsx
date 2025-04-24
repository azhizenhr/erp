import React from 'react'
import Sidebar from '../components/EmployeeDashBoard/Sidebar'
import {Outlet} from 'react-router-dom'
import Navbar from './Navbar'

const EmployeeDashBoard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="pt-12 md:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashBoard