import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`/api/leave/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('API Response:', response.data);

        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        console.error('Error fetching leave:', error);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert('Failed to fetch leave details');
        }
      }
    };

    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    //   console.log('Status Update Response:', response.data);

      if (response.data.success) {
        navigate('/admin-dashboard/leaves');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert('Failed to update leave status');
      }
    }
  };

  return (
    <>
      {leave ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Moved Leave Details heading here */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800 mt-8">
            Leave Details
          </h2>
          <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Image */}
              <div className="flex justify-center sm:justify-start">
                {leave.employeeId?.userId?.profileImage ? (
                  <img
                    src={leave.employeeId.userId.profileImage}
                    alt={leave.employeeId.userId.name}
                    className="rounded-full border w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 object-cover"
                    onError={(e) => {
                      e.target.src = '/fallback-image.jpg';
                    }}
                  />
                ) : (
                  <div className="w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 rounded-full border flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Name:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {leave.employeeId.userId.name}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Employee ID:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {leave.employeeId.employeeId}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Leave Type:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {leave.leaveType}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Reason:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
                    {leave.reason}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Department:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {leave.employeeId.department?.dep_name || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">Start Date:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">End Date:</p>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <p className="text-base sm:text-lg font-bold text-gray-700">
                    {leave.status === 'Pending' ? 'Action:' : 'Status:'}
                  </p>
                  {leave.status === 'Pending' ? (
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button
                        className="px-3 py-1 bg-green-300 hover:bg-green-400 text-sm sm:text-base font-medium rounded-md transition-colors"
                        onClick={() => changeStatus(leave._id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-300 hover:bg-red-400 text-sm sm:text-base font-medium rounded-md transition-colors"
                        onClick={() => changeStatus(leave._id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-base sm:text-lg font-medium text-gray-900">{leave.status}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Remaining Leave Balance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-md shadow-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm sm:text-base font-semibold text-gray-700 border-b">
                        Month
                      </th>
                      <th className="px-4 py-2 text-left text-sm sm:text-base font-semibold text-gray-700 border-b">
                        Remaining Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm sm:text-base text-gray-900 border-b">
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-2 text-sm sm:text-base text-gray-900 border-b">
                        {leave.employeeId.leaveBalance}{' '}
                        {leave.employeeId.leaveBalance === 1 ? 'day' : 'days'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading...
        </div>
      )}
    </>
  );
};

export default Detail;