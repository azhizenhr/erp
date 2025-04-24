import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import AdminDashBoard from './pages/AdminDashBoard';
import EmployeeDashBoard from './pages/EmployeeDashBoard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBasedRoutes from './utils/RoleBasedRoutes';
import AuthContext, { useAuth } from './context/authContext.jsx'; // Import AuthContext
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';
import EditDepartment from './components/department/EditDepartment';
import EmployeeList from './components/employee/EmployeeList';
import AddEmployee from './components/employee/AddEmployee';
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import Add from "./components/salary/AddSalary";
import ViewSalary from "./components/salary/ViewSalary";
import SummaryCard from './components/EmployeeDashBoard/Summary';
import List from "./components/leave/List";
import AddLeave from "./components/leave/AddLeave";
import Setting from "./components/EmployeeDashBoard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthContext> {/* Wrap everything in AuthContext */}
        <AppRoutes />
      </AuthContext>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null; // Wait for auth verification

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <Navigate to="/employee-dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      <Route path="/admin-dashboard" element={
        <PrivateRoutes>
          <RoleBasedRoutes requiredRole={["admin"]}>
            <AdminDashBoard />
          </RoleBasedRoutes>             
        </PrivateRoutes>
      }>
        <Route index element={<AdminSummary />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="department/:id" element={<EditDepartment />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="employees/:id" element={<View />} />
        <Route path="employees/edit/:id" element={<Edit />} />
        <Route path="employees/salary/:id" element={<ViewSalary />} />
        <Route path="salary/add" element={<Add />} />
        <Route path="leaves" element={<Table />} />
        <Route path="leaves/:id" element={<Detail />} />
        <Route path="employees/leaves/:id" element={<List />} />
        <Route path="setting" element={<Setting />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="attendance-report" element={<AttendanceReport />} />
      </Route>

      <Route path="/employee-dashboard" element={
        <PrivateRoutes>
          <RoleBasedRoutes requiredRole={["admin", "employee","intern"]}>
            <EmployeeDashBoard />
          </RoleBasedRoutes>
        </PrivateRoutes>
      }>
        <Route index element={<SummaryCard />} />
        <Route path="profile/:id" element={<View />} />
        <Route path="leaves/:id" element={<List />} />
        <Route path="add-leave" element={<AddLeave />} />
        <Route path="salary/:id" element={<ViewSalary />} />
        <Route path="setting/:id" element={<Setting />} />
      </Route>
    </Routes>
  );
}

export default App;