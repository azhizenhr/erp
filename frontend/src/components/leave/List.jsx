import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const List = () => {
    const [leaves, setLeaves] = useState(null);
    let sno = 1;
    const { id } = useParams();
    const { user } = useAuth();

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`/api/leave/${id}/${user.role}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // console.log(response.data);

            if (response.data.success) {
                setLeaves(response.data.leaves);
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    if (!leaves) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="p-4 sm:p-6 mt-4">
            <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-7">
                    Manage Leaves
                </h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                
                {["employee", "intern"].includes(user.role) && (
                    
                        
                    <Link
                        to="/employee-dashboard/add-leave"
                        className="px-2 py-1 sm:px-4 sm:py-1.5 bg-[#00B4D9] hover:bg-[#00B4D9] rounded-md text-white text-sm sm:text-base w-full sm:w-auto text-center"
                    >
                        Add New Leave
                    </Link>
                   
                   
                )}
            </div>
            <div className="mt-4 sm:mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200 whitespace-nowrap">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">SNO</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">Leave Type</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">From</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">To</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">Description</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((leave) => (
                            <tr
                                key={leave._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="px-2 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                                    {sno++}
                                </td>
                                <td className="px-2 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                                    {leave.leaveType}
                                </td>
                                <td className="px-2 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                                    {new Date(leave.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-2 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                                    {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-2 sm:px-6 py-2 sm:py-3">{leave.reason}</td>
                                <td className="px-2 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                                    {leave.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;