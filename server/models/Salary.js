import mongoose from "mongoose";

const salarySchema=new mongoose.Schema({
    employeeId:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true},
    basicSalary:{type:Number,required:true},
    allowances:{type:Number},
    deductions:{type:Number},
    payDate:{type:Date,required:true},
    netSalary:{type:Number},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
})

const Salary=mongoose.model('Salary',salarySchema);
export default Salary;