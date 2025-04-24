import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

const SummaryCard = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveSummary = async () => {
      try {
        const response = await axios.get(`/api/employee/leave-summary/${user._id}`);
        setLeaveBalance(response.data.totalLeaveBalance);
        setPendingLeavesCount(response.data.pendingLeavesCount);
      } catch (error) {
        console.error('Error fetching leave summary:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchLeaveSummary();
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-6">
      <div className="rounded-lg bg-white shadow-md w-full max-w-md mx-auto lg:max-w-full">
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
        <div className="flex">
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
              ) : leaveBalance !== null ? (
                `Total Leave Days Remaining: ${leaveBalance}`
              ) : (
                'Unable to fetch leave balance'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;