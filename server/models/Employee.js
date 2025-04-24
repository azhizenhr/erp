import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String },
    maritalStatus: { type: String },
    designation: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    leaveBalances: [
        {
            balance: {
                type: Number,
                default: 5
            },
            month: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now }
});

employeeSchema.post("save", async function (doc, next) {
    try {
        // Only initialize if leaveBalances is empty
        if (!doc.leaveBalances || doc.leaveBalances.length === 0) {
            const currentDate = new Date();
            const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

            // Initialize a single leave balance entry for the month
            await mongoose.model("Employee").updateOne(
                { _id: doc._id },
                {
                    $set: {
                        leaveBalances: [{
                            balance: 5,
                            month: month
                        }]
                    }
                }
            );
        }

        next();
    } catch (error) {
        next(error);
    }
});

employeeSchema.statics.findInterns = async function () {
    try {
        const internUsers = await mongoose.model('User').find({ role: 'intern' }).select('_id email role');

        const internUserIds = internUsers.map(user => user._id);

        const interns = await this.find({ userId: { $in: internUserIds } })
            .populate('userId', 'email role') 
            .populate('department', 'name'); 

        return interns;
    } catch (error) {
        throw new Error(`Failed to find interns: ${error.message}`);
    }
};

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;