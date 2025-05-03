import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Salary from '../models/Salary.js';
import Leave from '../models/Leave.js';

export const getSummary = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();

        const interns = await Employee.findInterns();
        const totalInterns = interns.length;
        // console.log('Interns found:', interns.map(intern => ({
        //     employeeId: intern._id,
        //     userId: intern.userId,
        //     designation: intern.designation
        // })));

        // Total number of departments
        const totalDepartments = await Department.countDocuments();

        // Total salary for all employees
        const totalSalaries = await Salary.aggregate([
            { $group: { _id: null, totalSalary: { $sum: '$netSalary' } } }
        ]);
        // console.log('Total salaries:', totalSalaries);

        // Total salary for interns
        const internEmployeeIds = interns.map(intern => intern._id); // Employee._id
        console.log('Intern Employee IDs:', internEmployeeIds);
        const totalInternSalaries = await Salary.aggregate([
            {
                $match: {
                    employeeId: {
                        $in: internEmployeeIds.map(id => new mongoose.Types.ObjectId(id))
                    }
                }
            },
            { $group: { _id: null, totalInternSalary: { $sum: '$netSalary' } } }
        ]);
        // console.log('Total intern salaries:', totalInternSalaries);

        // Distinct employees who applied for leave
        const employeeAppliedForLeave = await Leave.distinct('employeeId');

        // Leave status counts
        const leaveStatus = await Leave.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Construct leave summary
        const leavesummary = {
            appliedFor: employeeAppliedForLeave.length,
            approved: leaveStatus.find(item => item._id === 'Approved')?.count || 0,
            rejected: leaveStatus.find(item => item._id === 'Rejected')?.count || 0,
            pending: leaveStatus.find(item => item._id === 'Pending')?.count || 0,
        };

        return res.status(200).json({
            success: true,
            totalEmployees,
        
            totalDepartments,
            totalSalary: totalSalaries[0]?.totalSalary || 0,
        
            leavesummary
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard summary'
        });
    }
};