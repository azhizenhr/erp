import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { columns, LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';

const Table = () => {
  const [leaves, setLeaves] = useState(null);
  const [filteredLeaves, setFilteredLeaves] = useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('/api/leave', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => {
          // Normalize dates to remove time components
          const start = new Date(new Date(leave.startDate).setHours(0, 0, 0, 0));
          const end = new Date(new Date(leave.endDate).setHours(0, 0, 0, 0));
          if (isNaN(start) || isNaN(end)) {
            return null; // Skip invalid dates
          }
          // Calculate total days: same or next day counts as 1 day
          const timeDiff = end - start;
          const totalDays = (timeDiff <= 1000 * 60 * 60 * 24) ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          // Calculate extra days beyond 5
          const extraDays = totalDays > 5 ? totalDays - 5+1 : 0;

          return {
            _id: leave._id,
            sno: sno++,
            employeeId: leave.employeeId.employeeId ?? '',
            name: leave.employeeId.userId.name,
            leaveType: leave.leaveType,
            department: leave.employeeId.department.dep_name,
            days: extraDays, // Show only extra days beyond 5
            status: leave.status,
            action: <LeaveButtons id={leave._id} />,
          };
        });

        // Filter out invalid leaves
        const validData = data.filter((item) => item !== null);

        setLeaves(validData);
        setFilteredLeaves(validData);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || 'Failed to fetch leaves');
      } else {
        alert('Server error while fetching leaves');
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const data = leaves.filter((leave) =>
      (leave.name || '').toLowerCase().includes(searchTerm)
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  return (
    <>
      {filteredLeaves ? (
        <div className="p-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mt-18">Manage Leaves</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search By Employee Name"
              className="w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base"
              onChange={filterByInput}
              aria-label="Search leaves by employee name"
            />
            <div className="space-x-3">
              <button
                className="px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]"
                onClick={() => filterByButton('Pending')}
              >
                Pending
              </button>
              <button
                className="px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]"
                onClick={() => filterByButton('Approved')}
              >
                Approved
              </button>
              <button
                className="px-2 py-1 bg-[#00B4D9] text-white hover:bg-[#00B4D9]"
                onClick={() => filterByButton('Rejected')}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="mt-3">
            <DataTable columns={columns} data={filteredLeaves} pagination />
          </div>
        </div>
      ) : (
        <div>Loading ....</div>
      )}
    </>
  );
};

export default Table;