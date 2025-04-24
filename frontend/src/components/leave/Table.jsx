import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from "react";
import { columns, LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';


const Table = () => {
    const [leaves, setLeaves] = useState(null)
    const [filteredLeaves, setfilteredLeaves] = useState(null)

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('/api/leave',{
        headers : {
          "Authorization" : `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(response);
      console.log(response.data.success);
      
      if(response.data.success){
        console.log("here");
        
        let sno = 1;
        const data =  response.data.leaves.map((leave) => (
          {
            _id: leave._id,
            sno: sno++,
            employeeId: leave.employeeId.employeeId!==null?leave.employeeId.employeeId:"",
            name:leave.employeeId.userId.name,
            leaveType: leave.leaveType,
            department: leave.employeeId.department.dep_name,
            days:
              new Date(leave.endDate).getDate()-
              new Date(leave.startDate).getDate(),
            status: leave.status,
            action: (<LeaveButtons id={leave._id}/>),
          }
         
          
        ));
        console.log(data);
        setLeaves(data);
        setfilteredLeaves(data)
      }
    }catch(error){
      if(error.response && error.response.data.success){
          alert(error.response.data.error)
    }
  }
  }
  useEffect(() => {
      fetchLeaves()
  }, [])

  const filterByInput = (e) => {
    const data = leaves.filter(leave => leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
  )
  setfilteredLeaves(data)
  }
  const filterByButton = (status) => {
    const data = leaves.filter((leave) => leave.status.toLowerCase().includes(status.toLowerCase())
  )
  setfilteredLeaves(data)
  }

  return (
    <>
    {filteredLeaves ? (
    <div className='p-6 '>
      <div className='text-center'>
        <h3 className='text-xl sm:text-2xl font-bold mt-18'>Manage Leaves</h3>  

        </div>
        <div className='flex justify-between items-center'>
        <input 
              type="text" 
              placeholder='Search By Name' 
              className='w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base'
              onChange={filterByInput}
            />
        <div className='space-x-3'>
        <button className='px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]' onClick={() => filterByButton("Pending")}>Pending</button>
        <button className='px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]' onClick={() => filterByButton("Approved")}>Approved</button>
        <button className='px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]' onClick={() => filterByButton("Rejected")}>Rejected</button>
        </div>
    </div>

      <div className='mt-3'>
    <DataTable columns={columns} data={filteredLeaves} pagination/>
    </div>
    </div>
  ) : <div>Loading ....</div> }
  </>
  )
}

export default Table
