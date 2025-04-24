import mongoose from "mongoose";
import Employee from "./Employee.js";
import Leave from "./Leave.js";
import Salary from "./Salary.js";


const departmentSchema=new mongoose.Schema({
    dep_name: {type: String, required: true},
    description: {type: String},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

departmentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await Employee.updateMany(
            { department: this._id },
            { $set: { department: '' } }
        );

        next();
    } catch (error) {
        console.error('Error in department deleteOne middleware:', error);
        next(error);
    }
});
const Department = mongoose.model("Department", departmentSchema)
export default Department;