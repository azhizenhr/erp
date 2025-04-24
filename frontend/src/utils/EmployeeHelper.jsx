import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "130px",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "130px",
    },
    {
        name: "Image",
        selector: (row) => row.profileImage,
        width: "130px",
        cell: (row) => (
            <div className="flex items-center justify-center">
                {row.profileImage}
            </div>
        ),
    },
    {
        name: "Department",
        selector: (row) => row.dep_name,
        width: "130px",
    },
    {
        name: "DOB",
        selector: (row) => row.dob,
        width: "130px",
        sortable: true,
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
        
    },
];

export const fetchDepartments = async () => {
    try {
        const response = await axios.get('/api/department', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.data.success) {
            return response.data.departments;
        } else {
            throw new Error('Failed to fetch departments');
        }
    } catch (error) {
        console.error('Error fetching departments:', error);
        return null;
    }
};

export const getEmployees = async (id) => {
    try {
        const response = await axios.get(`/api/employee/department/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.data.success) {
            return response.data.employees;
        } else {
            throw new Error('Failed to fetch employees');
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        return null;
    }
};

export const EmployeeButtons = ({ id, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto">
            <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-base rounded-md transition-colors whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employees/${id}`)}
            >
                View
            </button>
            <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-[#00B4D9] hover:bg-[#0096b5] text-white text-xs sm:text-base rounded-md transition-colors whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
            >
                Edit
            </button>
            <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs sm:text-base rounded-md transition-colors whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employees/salary/${id}`)}
            >
                Salary
            </button>
            <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-base rounded-md transition-colors whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employees/leaves/${id}`)}
            >
                Leave
            </button>
            <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-base rounded-md transition-colors whitespace-nowrap"
                onClick={() => onDelete(id)}
            >
                Delete
            </button>
        </div>
    );
};