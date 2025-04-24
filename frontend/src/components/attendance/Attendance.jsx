import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { columns, AttendanceHelper } from '../../utils/AttendanceHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/attendance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: (
            <AttendanceHelper
              status={att.status}
              employeeId={att.employeeId.employeeId}
              statusChange={statusChange}
            />
          ),
        }));
        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.message || 'Error fetching attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    const records = attendance.filter((emp) =>
      emp.employeeId.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.name.toLowerCase().includes(searchTerm)
    );
    setFilteredAttendance(records);
  };

  const customStyles = {
    table: {
      style: {
        width: '100%',
      },
    },
    responsiveWrapper: {
      style: {
        overflowX: 'auto',
        '-webkit-overflow-scrolling': 'touch',
      },
    },
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="overflow-x-auto sm:overflow-x-visible">
        <div className="min-w-[min-content]">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-9">
              Manage Attendance
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center flex-nowrap space-x-4 sm:space-x-0">
              <input
                type="text"
                placeholder="Search By Dep Name"
                className="w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base"
                value={search}
                onChange={handleFilter}
                aria-label="Search attendance records"
              />
              <p className="text-sm sm:text-base whitespace-nowrap">
                Mark Employee for{' '}
                <span className="font-bold underline">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </p>
              <Link
                to="admin-dashboard/attendance-report"
                className="px-2 py-0.5 sm:px-4 sm:py-1 bg-[#00B4D9] rounded text-white text-sm sm:text-base"
                aria-label="View attendance report"
              >
                Attendance Report
              </Link>
            </div>
          </div>
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredAttendance.length === 0 ? (
              <div className="text-center py-8">No attendance records found.</div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredAttendance}
                pagination
                responsive
                customStyles={customStyles}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;