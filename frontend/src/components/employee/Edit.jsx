import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const [employee, setEmployee] = useState({
        name: '',
        maritalStatus: '',
        designation: '',
        salary: 0,
        department: ''
    });
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                
                if (response.data.success) {
                    const employee = response.data.employee;
                    setEmployee((prev) => ({
                        ...prev,
                        name: employee.userId.name,
                        maritalStatus: employee.maritalStatus,
                        designation: employee.designation,
                        salary: employee.salary,
                        department: employee.department
                    }));
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/employee/${id}`, employee, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <>
          {departments && employee ? (
            <div className='max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-12 bg-white p-4 sm:p-6 md:p-8 rounded-md shadow-md '>
              <h2 className='text-xl sm:text-2xl  md:text-2xl font-bold mb-4 sm:mb-6 mt-5'>Edit Employee</h2>
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6'>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700'>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder='Enter your Name'
                      value={employee.name}
                      className='mt-1 p-1 sm:p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base'
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700'>Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={employee.maritalStatus}
                      className='mt-1 p-1 sm:p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base'
                      required
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700'>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      placeholder='Designation'
                      className='mt-1 p-1 sm:p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base'
                      required
                      onChange={handleChange}
                      value={employee.designation}
                    />
                  </div>
                  <div>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700'>Salary</label>
                    <input
                      type="number"
                      name="salary"
                      onChange={handleChange}
                      placeholder='Salary'
                      className='mt-1 p-1 sm:p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base'
                      required
                      value={employee.salary}
                    />
                  </div>
                  <div className='col-span-1 md:col-span-2'>
                    <label className='block text-xs sm:text-sm font-medium text-gray-700'>Department</label>
                    <select
                      name="department"
                      value={employee.department}
                      className='mt-1 p-1 sm:p-2 block w-full border border-gray-300 rounded-md text-sm sm:text-base'
                      required
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className='w-full mt-4 sm:mt-6 bg-[#00B4D9] hover:bg-[#00B4D9] text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded text-sm sm:text-base'
                >
                  Edit Employee
                </button>
              </form>
            </div>
          ) : (
            <div className='flex items-center justify-center h-screen text-sm sm:text-base'>Loading...</div>
          )}
        </>
      );
};

export default Edit;