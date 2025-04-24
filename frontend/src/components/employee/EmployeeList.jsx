import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
        setEmpLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/employee', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                let sno = 1;
                const data = response.data.employees.map((emp) => ({
                    _id: emp._id,
                    sno: sno++,
                    dep_name: emp.department.dep_name,
                    name: emp.userId.name,
                    dob: new Date(emp.dob).toLocaleDateString(),
                    profileImage: emp.userId.profileImage ? (
                        <img
                            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
                            src={`${emp.userId.profileImage}?w=40&h=40`}
                            alt="Profile"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : (
                        <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200">
                            <FaUser className="text-gray-500 text-sm sm:text-base" />
                        </div>
                    ),
                    action: <EmployeeButtons id={emp._id} onDelete={handleDelete} />,
                }));
                setEmployees(data);
                setFilteredEmployees(data);
            } else {
                setError('Failed to fetch employees');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to fetch employees';
            setError(errorMsg);
        } finally {
            setEmpLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            const response = await axios.delete(`/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                setError(null);
                await fetchEmployees(); // Refresh the employee list
            } else {
                setError('Failed to delete employee');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to delete employee';
            setError(errorMsg);
        }
    };

    const handleFilter = (e) => {
        const records = employees.filter((emp) =>
            emp.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredEmployees(records);
    };

    return (
        <div className="min-h-screen flex flex-col p-2 sm:p-4 md:p-6 bg-gray-100">
            <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mt-10">Manage Employees</h3>
            </div>
            {error && (
                <div className="mb-3 sm:mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm sm:text-base text-center">
                    {error}
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2 sm:gap-3">
                <input
                    type="text"
                    placeholder="Search By Name"
                    className="w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base"
                    onChange={handleFilter}
                />
                <Link
                    to="/admin-dashboard/add-employee"
                    className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-1 sm:py-2 bg-[#00B4D9] rounded-md text-white text-sm sm:text-base text-center hover:bg-[#00B4D9] transition-colors"
                >
                    Add New Employee
                </Link>
            </div>
            <div className="flex-grow mt-3 sm:mt-4 bg-white rounded-md shadow-md">
                <DataTable
                    columns={columns}
                    data={filteredEmployees}
                    pagination
                    progressPending={empLoading}
                    responsive
                    className="w-full"
                    customStyles={{
                        table: {
                            style: {
                                minWidth: '100%',
                            },
                        },
                        headCells: {
                            style: {
                                fontSize: '10px sm:12px md:14px',
                                fontWeight: 'bold',
                                padding: '6px sm:8px md:10px',
                                whiteSpace: 'nowrap',
                            },
                        },
                        cells: {
                            style: {
                                fontSize: '11px sm:13px md:14px',
                                padding: '6px sm:8px md:10px',
                            },
                        },
                        pagination: {
                            style: {
                                borderTop: '1px solid #e5e7eb',
                                fontSize: '12px sm:14px',
                            },
                        },
                    }}
                    noDataComponent={<div className="p-3 sm:p-4 text-center text-sm sm:text-base">No employees found</div>}
                    progressComponent={<div className="p-3 sm:p-4 text-center text-sm sm:text-base">Loading...</div>}
                />
            </div>
        </div>
    );
};

export default EmployeeList;