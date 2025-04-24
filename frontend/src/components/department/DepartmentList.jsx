import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { DepartmentButtons, columns } from '../../utils/DepartmentHelper';
import axios from 'axios';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [depLoading, setDepLoading] = useState(false);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [success, setSuccess] = useState(null);

    const fetchDepartments = async () => {
        setDepLoading(true);
        try {
            const response = await axios.get('/api/department', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                let sno = 1;
                const data = response.data.departments.map((dep) => ({
                    _id: dep._id,
                    sno: sno++,
                    dep_name: dep.dep_name,
                    action: <DepartmentButtons id={dep._id} onDepartmentDelete={onDepartmentDelete} />,
                }));
                setDepartments(data);
                setFilteredDepartments(data);
            } else {
                alert(response.data.error || 'Failed to fetch departments');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to fetch departments';
            alert(errorMsg);
        } finally {
            setDepLoading(false);
        }
    };

    const onDepartmentDelete = () => {
        fetchDepartments();
       
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const filterDepartments = (e) => {
        const records = departments.filter((dep) =>
            dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredDepartments(records);
    };

    return (
        <>
            {depLoading ? (
                <div className="flex justify-center items-center h-screen w-full">Loading...</div>
            ) : (
                <div className='min-h-screen w-full flex flex-col p-2 sm:p-4 pt-16 sm:pt-20 overflow-x-hidden'>
                    <div className='text-center mb-3 sm:mb-4'>
                        <h3 className='text-xl sm:text-2xl md:text-2xl font-bold'>Manage Departments</h3>
                    </div>
                    {success && (
                        <div className="mb-3 sm:mb-4 p-2 bg-green-100 text-green-700 rounded-md text-sm sm:text-base text-center">
                            {success}
                        </div>
                    )}
                    <div className='flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2 sm:gap-3'>
                        <input 
                            type="text" 
                            placeholder='Search By Name' 
                            className='w-full sm:w-56 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B4D9] text-sm sm:text-base'
                            onChange={filterDepartments}
                        />
                        <Link 
                            to="/admin-dashboard/add-department" 
                            className="w-full sm:w-auto px-2 sm:px-3 md:px-4 py-1 bg-[#00B4D9] rounded text-white text-center text-sm sm:text-base hover:bg-[#0096b5] whitespace-nowrap"
                        >
                            Add New Department
                        </Link>
                    </div>
                    <div className='flex-grow w-full overflow-y-auto max-h-[calc(100vh-200px)]'>
                        <DataTable
                            columns={columns}
                            data={filteredDepartments}
                            pagination
                            responsive
                            className='w-full'
                            customStyles={{
                                table: {
                                    style: {
                                        width: '100%',
                                        minWidth: '600px',
                                        overflowX: 'auto',
                                        maxWidth: '100%',
                                    },
                                },
                                tableWrapper: {
                                    style: {
                                        width: '100%',
                                        overflowX: 'auto',
                                        maxWidth: '100%',
                                        display: 'block',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#a0aec0 #edf2f7',
                                    },
                                },
                                headCells: {
                                    style: {
                                        fontSize: '10px sm:12px md:14px',
                                        fontWeight: 'bold',
                                        padding: '4px sm:6px md:8px',
                                        whiteSpace: 'nowrap',
                                    },
                                },
                                cells: {
                                    style: {
                                        fontSize: '10px sm:12px md:14px',
                                        padding: '4px sm:6px md:8px',
                                        whiteSpace: 'nowrap',
                                    },
                                },
                                pagination: {
                                    style: {
                                        fontSize: '12px sm:14px',
                                        padding: '4px sm:8px',
                                        borderTop: '1px solid #e5e7eb',
                                    },
                                },
                            }}
                            noDataComponent={<div className="p-3 sm:p-4 text-center text-sm sm:text-base">No departments found</div>}
                            progressComponent={<div className="p-3 sm:p-4 text-center text-sm sm:text-base">Loading...</div>}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default DepartmentList;