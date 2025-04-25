import React,{useState} from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddLeave = () => {
    const {user} = useAuth()
    const [leave, setLeave] = useState({
        userId:user._id,
    })

    const navigate = useNavigate()

  const handleChange = (e) => {
    const {name,value} = e.target 
    setLeave((prevState) => ({...prevState, [name] : value}))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`/api/leave/add`,leave,
            {
          headers : {
            "Authorization" : `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        if(response.data.success){
            navigate(`/employee-dashboard/leaves/${user._id}`)
        }
      }catch(error){
        if(error.response && error.response.data.success){
            alert(error.response.data.error)
      }
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-gray-800">
          Request For Leave
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              name="leaveType"
              onChange={handleChange}
              className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9] text-sm sm:text-base"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="SickLeave">Sick Leave</option>
              <option value="CasualLeave">Casual Leave</option>
              <option value="InternExamLeave">Intern Exam Leave</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                onChange={handleChange}
                className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9] text-sm sm:text-base"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                onChange={handleChange}
                className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9] text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="reason"
              placeholder="Reason"
              onChange={handleChange}
              className="w-full mt-1 p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9] text-sm sm:text-base min-h-[100px]"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 sm:mt-6 bg-[#00B4D9] hover:bg-[#00B4D9] text-white font-bold py-2 sm:py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeave;
