import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

const SummaryCard = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveSummary = async () => {
      try {
        const response = await axios.get(`/api/employee/leave-summary/${user._id}`);
        if (response.data.success) {
          setLeaveBalance(response.data.totalLeaveBalance);
          setApprovedLeavesCount(response.data.approvedLeavesCount);
        } else {
          setError(response.data.message || 'Failed to fetch leave summary');
        }
      } catch (error) {
        console.error('Error fetching leave summary:', error);
        setError('Server error while fetching leave summary');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchLeaveSummary();
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-6 bg-transparent">
      <div className="rounded-lg shadow-md w-full max-w-md mx-auto lg:max-w-full">
        {/* Welcome Back Section */}
        <div className="flex border-b border-gray-200">
          <div
            className="text-2xl sm:text-3xl lg:text-4xl flex justify-center items-center bg-[#00B4D9] text-white px-3 sm:px-4 lg:px-5 py-2"
          >
            <FaUser />
          </div>
          <div className="pl-3 sm:pl-4 lg:pl-5 py-2 flex-1">
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
              Welcome Back
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {user.name}
            </p>
          </div>
        </div>
        {/* Leave Status Section */}
        <div className="flex mt-6">
          <div
            className="text-2xl sm:text-3xl lg:text-4xl flex justify-center items-center bg-[#00B4D9] text-white px-3 sm:px-4 lg:px-5 py-2"
          >
            <FaCalendar />
          </div>
          <div className="pl-3 sm:pl-4 lg:pl-5 py-2 flex-1">
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
              Leave Status
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 truncate">
              {loading ? (
                'Loading leave balance...'
              ) : error ? (
                error
              ) : leaveBalance !== null ? (
                `Current Leave Balance: ${leaveBalance+1} / 5`
              ) : (
                'Unable to fetch leave balance'
              )}
            </p>
            {approvedLeavesCount !== null && (
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 truncate">
                Approved Leaves: {approvedLeavesCount}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;