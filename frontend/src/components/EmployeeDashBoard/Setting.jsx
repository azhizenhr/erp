import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios" ;
import { useAuth } from "../../context/authContext";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError("Password not matched");
    } else {
      try {
        const response = await axios.put(
          "/api/setting/change-password",
          setting,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          if(user.role==="admin"){
            navigate("/admin-dashboard/employees");
          }else{
            navigate("/employee-dashboard/")
          }
         
          setError("");
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-md shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Change Password</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-[#00B4D9] focus:border-[#00B4D9]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 sm:mt-6 bg-[#00B4D9] hover:bg-[#00B4D9] text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;

