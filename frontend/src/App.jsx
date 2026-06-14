import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import EditStudent from "./pages/EditStudent.jsx";
import Complaints from "./pages/Complaints.jsx";
import RegisterComplaint from "./pages/RegisterComplaint.jsx";
import Rooms from "./pages/Rooms.jsx";
import LeaveRequests from "./pages/LeaveRequests.jsx";
import FeeManagement from "./pages/FeeManagement.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-[#1e293b]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isAdmin = admin?.role === "admin";
  const isStudent = admin?.role === "student";
  const loggedIn = !!admin && (isAdmin || isStudent);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={loggedIn ? (isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/student-dashboard" />) : <Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/students" element={isAdmin ? <Students /> : <Navigate to="/" />} />
          <Route path="/students/add" element={isAdmin ? <AddStudent /> : <Navigate to="/" />} />
          <Route path="/students/edit/:id" element={isAdmin ? <EditStudent /> : <Navigate to="/" />} />
          <Route path="/complaints" element={isAdmin ? <Complaints /> : <Navigate to="/" />} />
          <Route path="/complaints/register" element={isAdmin ? <RegisterComplaint /> : <Navigate to="/" />} />
          <Route path="/rooms" element={isAdmin ? <Rooms /> : <Navigate to="/" />} />
          <Route path="/leave-requests" element={isAdmin ? <LeaveRequests /> : <Navigate to="/" />} />
          <Route path="/fee-management" element={isAdmin ? <FeeManagement /> : <Navigate to="/" />} />
        </Route>
        <Route path="/student-dashboard" element={isStudent ? <StudentDashboard /> : <Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
