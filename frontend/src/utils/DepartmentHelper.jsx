import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
        width: "250px", 
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true,
        width: "250px",
    },
    {
        name: "Action",
        selector: (row) => row.action,
        
    },
];

export const DepartmentButtons = ({ id, onDepartmentDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this department?");
        if (confirm) {
            try {
                const response = await axios.delete(`/api/department/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.success) {
                    onDepartmentDelete();
                } else {
                    alert(response.data.error || 'Failed to delete department');
                }
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to delete department';
                alert(errorMsg);
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex space-x-2 sm:space-x-3 flex-nowrap">
                <button
                    className="px-2 py-1 sm:px-3 sm:py-2 bg-[#00B4D9] text-white text-xs sm:text-base rounded hover:bg-[#0096b5] flex items-center justify-center whitespace-nowrap min-w-fit"
                    onClick={() => navigate(`/admin-dashboard/department/${id}`)}
                >
                    Edit
                </button>
                <button
                    className="px-2 py-1 sm:px-3 sm:py-2 bg-red-600 text-white text-xs sm:text-base rounded hover:bg-red-700 flex items-center justify-center whitespace-nowrap min-w-fit"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};