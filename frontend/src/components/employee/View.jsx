import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

const View = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success) {
                    setEmployee(response.data.employee);
                } else {
                    setError('Failed to fetch employee details');
                }
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch employee details';
                setError(errorMsg);
            }
        };

        fetchEmployee();
    }, [id]);

    return (
        <div className="min-h-screen w-full flex flex-col p-2 sm:p-4 bg-gray-100 mt-7">
            {error ? (
                <div className="flex-grow flex items-center justify-center text-center text-base sm:text-lg text-red-600">
                    {error}
                </div>
            ) : employee ? (
                <div className="flex-grow w-full mt-6 sm:mt-10 bg-white p-3 sm:p-4 md:p-8 rounded-md shadow-md">
                    <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
                        Employee Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
                        <div className="flex justify-center mb-3 sm:mb-4 md:mb-0">
                            {employee.userId.profileImage && !imgError ? (
                                <img
                                    src={`${employee.userId.profileImage}?w=300&h=300`}
                                    alt="Employee"
                                    className="rounded-full border w-32 sm:w-48 md:w-60 lg:w-72 h-32 sm:h-48 md:h-60 lg:h-72 object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="rounded-full border w-32 sm:w-48 md:w-60 lg:w-72 h-32 sm:h-48 md:h-60 lg:h-72 flex items-center justify-center bg-gray-200">
                                    <FaUser className="text-4xl sm:text-6xl md:text-8xl text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 sm:space-y-3 md:space-y-5">
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Name:</p>
                                <p className="text-sm sm:text-base font-medium break-words">{employee.userId.name}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Employee ID:</p>
                                <p className="text-sm sm:text-base font-medium break-words">{employee.employeeId}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Date of Birth:</p>
                                <p className="text-sm sm:text-base font-medium break-words">
                                    {new Date(employee.dob).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Gender:</p>
                                <p className="text-sm sm:text-base font-medium break-words">{employee.gender}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Team:</p>
                                <p className="text-sm sm:text-base font-medium break-words">{employee.department.dep_name}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-2 md:space-x-3">
                                <p className="text-sm sm:text-base md:text-lg font-bold shrink-0">Marital Status:</p>
                                <p className="text-sm sm:text-base font-medium break-words">{employee.maritalStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-center text-base sm:text-lg">
                    Loading...
                </div>
            )}
        </div>
    );
};

export default View;