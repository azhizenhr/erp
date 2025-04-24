import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AttendanceReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append('date', dateFilter);
      }
      const response = await axios.get(
        `/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        if (skip === 0) {
          setReport(response.data.groupData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...response.data.groupData,
          }));
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div className="min-h-screen p-4 sm:p-10 bg-white">
      <h2 className="text-center text-xl sm:text-2xl font-bold mt-6">
        Attendance Report
      </h2>
      <div className="mt-4">
        <h2 className="text-lg sm:text-xl font-semibold">Filter by Date</h2>
        <input
          type="date"
          className="w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSkip(0);
          }}
          aria-label="Filter attendance by date"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : Object.keys(report).length === 0 ? (
        <div className="text-center py-8">No records found.</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div className="mt-4 border-b" key={date}>
            <h2 className="text-lg sm:text-xl font-semibold">{date}</h2>
            <div className="overflow-x-auto">
              <table
                className="border-separate border border-gray-300 w-full"
                style={{ borderSpacing: '10px' }}
                cellPadding="10"
              >
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                      S No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                      Employee ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                      Department
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {record.map((data, i) => (
                    <tr key={data.employeeId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                        {i + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                        {data.employeeId}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                        {data.employeeName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                        {data.departmentName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm sm:text-base">
                        {data.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      {!loading && Object.keys(report).length > 0 && (
        <button
          className="px-4 py-2 border bg-gray-100 text-lg font-semibold mt-4 w-full sm:w-auto"
          onClick={handleLoadMore}
          aria-label="Load more attendance records"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default AttendanceReport;