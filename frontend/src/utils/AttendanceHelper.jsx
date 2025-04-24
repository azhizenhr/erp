import React from 'react';
import axios from 'axios';

export const columns = [
  {
    name: 'S No',
    selector: (row) => row.sno,
    width: '100px',
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    width: '100px',
  },
  {
    name: 'Emp ID',
    selector: (row) => row.employeeId,
    sortable: true,
    width: '100px',
  },
  {
    name: 'Department',
    selector: (row) => row.department,
    width: '120px',
  },
  {
    name: 'Action',
    selector: (row) => row.action,
    center: 'true',
  },
];

export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
  const markEmployee = async (statusValue) => {
    try {
      const response = await axios.put(
        `/api/attendance/update/${employeeId}`,
        { status: statusValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        statusChange();
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
        statusChange();
      }
    }
  };

  return (
    <div>
      {status == null ? (
        <div className="flex space-x-8 sm:space-x-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded text-sm sm:px-2 sm:py-1 "
            onClick={() => markEmployee('present')}
            aria-label="Mark employee as present"
          >
            Present
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded text-sm sm:px-2 sm:py-1 "
            onClick={() => markEmployee('workFromHome')}
            aria-label="Mark employee as absent"
          >
            Work From Home
          </button>
          
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded text-sm sm:px-2 sm:py-1 "
            onClick={() => markEmployee('leave')}
            aria-label="Mark employee as on leave"
          >
            Leave
          </button>
        </div>
      ) : (
        <p
          className="bg-gray-100 w-20 text-center py-2 rounded text-sm"
          aria-label={`Attendance status: ${status}`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default AttendanceHelper;