import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding,FaCalendarAlt,FaCogs,FaMoneyBillWave, FaTachometerAlt, FaUsers, FaRegCalendarAlt} from 'react-icons/fa'
import { useAuth } from '../../context/authContext'

const Sidebar = () => {
    const {user} = useAuth()
    // console.log(user);
    
  return (
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
      <div className='bg-[#00B4D9] h-12 flex items-center justify-center'>
        <h3 className='text-2xl text-center font-pacific'>Employee MS</h3>
      </div>
      <div className='px-4'>
        <NavLink to="/employee-dashboard"
        className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`} end>
           <FaTachometerAlt/>
           <span>DashBoard</span>
        </NavLink>
        <NavLink to={`/employee-dashboard/profile/${user._id}`}
className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`} end>           <FaUsers/>
           <span>My Profile</span>
        </NavLink>
        <NavLink to={`/employee-dashboard/leaves/${user._id}`}
         className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`}>
           <FaBuilding/>
           <span>Leaves</span>
        </NavLink>

        <NavLink to={`/employee-dashboard/salary/${user._id}`}
         className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`}
         >
           <FaCalendarAlt/>
           <span>Salary</span>
        </NavLink>
        
        {/* <NavLink to={`/employee-dashboard/attendance/${user._id}`}
         className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`}
         >
           <FaRegCalendarAlt/>
           <span>Attendance</span>
        </NavLink> */}

        <NavLink to="/employee-dashboard/setting/id"
         className={({isActive})=>`${isActive?"bg-[#00B4D9]":" "} flex items-center space-x-4  py-2.5 px-4 rounded`}
        >
           <FaCogs/>
           <span>Settings</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar