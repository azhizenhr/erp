import React, { useEffect, useState } from 'react';
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [salary, setSalary] = useState({
        employeeName:null,
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: null,
    });
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSalary((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/salary/add`, salary, {
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

    const handleDepartment = async (e) => {
        const emp = await getEmployees(e.target.value);
        console.log(emp);
        
        setEmployees(emp);
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {departments ? (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 mt-8">
                        Add Salary
                    </h2>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Team
                                    </label>
                                    <select
                                        name="department"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleDepartment}
                                    >
                                        <option value="">Select Team</option>
                                        {departments.map(dep => (
                                            <option key={dep._id} value={dep._id}>
                                                {dep.dep_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Employee
                                    </label>
                                    <select
                                        name="employeeId"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.userId.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Basic Salary
                                    </label>
                                    <input
                                        type="number"
                                        name="basicSalary"
                                        placeholder="Basic Salary"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Allowances
                                    </label>
                                    <input
                                        type="number"
                                        name="allowances"
                                        placeholder="Allowances"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Deductions
                                    </label>
                                    <input
                                        type="number"
                                        name="deductions"
                                        placeholder="Deductions"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pay Date
                                    </label>
                                    <input
                                        type="date"
                                        name="payDate"
                                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00B4D9] focus:border-[#00B4D9] transition-colors"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#00B4D9] hover:bg-[#00B4D9] text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                Add Salary
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-600">
                    Loading...
                </div>
            )}
        </div>
    );
};

export default Add;