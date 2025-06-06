import path from "path";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import mongoose from "mongoose";

export const addLeave = async (req, res) => {
    try {
        const { userId, startDate, endDate, reason, leaveType, status } = req.body;
        
        const employee = await Employee.findOne({ userId });
        // console.log(employee);
        
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Normalize dates to remove time components
        const start = new Date(new Date(startDate).setHours(0, 0, 0, 0));
        const end = new Date(new Date(endDate).setHours(0, 0, 0, 0));
        // Ensure dates are valid
        if (isNaN(start) || isNaN(end) || start > end) {
            return res.status(400).json({ success: false, error: "Invalid date range" });
        }

        // Calculate leave days: same or next day counts as 1 day
        const timeDiff = end - start;
        const leaveDays = (timeDiff <= 1000 * 60 * 60 * 24) ? 1 : Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        const newLeave = new Leave({
            employeeId: employee._id,
            startDate,
            endDate,
            reason,
            leaveType,
            status: status || "Pending" // Default to "Pending" if status not provided
        });

        await newLeave.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave add server error" });
    }
};

export const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "Invalid leave ID" });
        }

        // Find the leave to get details
        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ success: false, error: "leave not found" });
        }

        // If status is being updated to "Approved", update leave balance
        if (req.body.status === "Approved" && leave.status !== "Approved") {
            const currentDate = new Date();
            const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

            // Normalize dates to remove time components
            const start = new Date(new Date(leave.startDate).setHours(0, 0, 0, 0));
            const end = new Date(new Date(leave.endDate).setHours(0, 0, 0, 0));
            // Ensure dates are valid
            if (isNaN(start) || isNaN(end) || start > end) {
                return res.status(400).json({ success: false, error: "Invalid date range" });
            }

            // Calculate leave days: count each date inclusively
            const timeDiff = end - start;
            const leaveDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
            // console.log(`Updating leave ${id}: Start=${start}, End=${end}, LeaveDays=${leaveDays}`);

            // Find the employee
            const employee = await Employee.findById(leave.employeeId);
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }

            // Find the leave balance for the month
            const leaveBalance = employee.leaveBalances.find(balance => balance.month === month);

            if (!leaveBalance || leaveBalance.balance < leaveDays) {
                return res.status(400).json({ success: false, error: "Insufficient leave balance" });
            }

            // Deduct leave balance
            leaveBalance.balance -= leaveDays;

            // Update the employee's leaveBalances
            await Employee.updateOne(
                { _id: leave.employeeId, "leaveBalances._id": leaveBalance._id },
                { $set: { "leaveBalances.$.balance": leaveBalance.balance, updatedAt: Date.now() } }
            );
        }

        // Update the leave status
        const updatedLeave = await Leave.findByIdAndUpdate(
            { _id: id },
            { status: req.body.status, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({ success: false, error: "leave not found" });
        }

        return res.status(200).json({ success: true, data: updatedLeave });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave update server error" });
    }
};

export const getLeave = async (req, res) => {
  
    try {
        const { id, role } = req.params;
        let leaves;
        let employee;

        if (role === "admin") {
            employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }
            leaves = await Leave.find({ employeeId: id });
        } else {
            employee = await Employee.findOne({ userId: id });
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }
            leaves = await Leave.find({ employeeId: employee._id });
        }

        // Get leave balance for the current month
        const currentDate = new Date();
        const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
        const leaveBalance = employee.leaveBalances.find(balance => balance.month === month)?.balance || 0;

        return res.status(200).json({ success: true, leaves, leaveBalance });
    } catch (error) {
        console.log(error.message);
        console.log("Error in getLeave");
        return res.status(500).json({ success: false, error: "leave fetch server error" });
    }
};

export const getLeaves = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

        // Fetch all leaves with populated employee, department, and user details
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {
                    path: "department",
                    select: "dep_name"
                },
                {
                    path: "userId",
                    select: "name"
                }
            ]
        });

        // Enhance each leave with employee's leave balance for the current month
        const enhancedLeaves = leaves.map(leave => {
            const employee = leave.employeeId;
            if (!employee) {
                return leave.toObject();
            }

            // Get leave balance
            const leaveBalance = employee.leaveBalances.find(balance => balance.month === month)?.balance || 0;

            // Create a new employee object with leaveBalance
            const enhancedEmployee = {
                ...employee.toObject(),
                leaveBalance
            };

            return {
                ...leave.toObject(),
                employeeId: enhancedEmployee
            };
        });

        // console.log("Fetched leaves with balances");
        return res.status(200).json({ success: true, leaves: enhancedLeaves });
    } catch (error) {
        console.log("error in getLeaves");
        console.log(error.message);
        return res.status(500).json({ success: false, error: "leave fetch server error" });
    }
};

export const getLeaveDetail = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch leave with populated employee, department, and user details
      const leave = await Leave.findById(id).populate({
        path: "employeeId",
        populate: [
          {
            path: "department",
            select: "dep_name",
          },
          {
            path: "userId",
            select: "name profileImage",
          },
        ],
      });
  
      if (!leave) {
        return res.status(404).json({ success: false, error: "Leave not found" });
      }
  
      // Get leave balance for the current month
      const currentDate = new Date();
      const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
      const leaveBalance = leave.employeeId?.leaveBalances.find(balance => balance.month === month)?.balance || 0;
  
      // Create enhanced employee object with leaveBalance
      const enhancedEmployee = leave.employeeId
        ? {
            ...leave.employeeId.toObject(),
            leaveBalance,
          }
        : null;
  
      // Create enhanced leave object
      const enhancedLeave = {
        ...leave.toObject(),
        employeeId: enhancedEmployee,
      };
  
    //   console.log("Fetched leave detail with balance");
      return res.status(200).json({ success: true, leave: enhancedLeave });
    } catch (error) {
      console.error("Error in getLeaveDetail:", error.message);
      return res.status(500).json({ success: false, error: "Server error" });
    }
  };

  export const leaveBalance=async (req, res) => {
    try {
      const userId = req.user._id; 
      const employee = await Employee.findOne({ userId });
      const balance = employee.leaveBalance || 0; 
      return res.json({ success: true, balance });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }