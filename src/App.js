import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PatientRecord from "./components/PatientRecord";
import MedicalRecord from "./components/MedicalRecord";
import RegisterForm from "./components/Register";
import SearchPage from "./components/SearchPage";
import ManageNurse from "./components/ManageNurse";
import ProtectedRoute from "./JWTconfig/protectedRoute";

// Layout dengan sidebar
const MainLayout = () => (
  <div className="App bg-gradient-to-tr from-gray-800 via-slate-900 to-gray-800">
    <Sidebar />
    <div className="content">
      <Outlet /> {/* Gunakan Outlet di sini */}
    </div>
  </div>
);

// Layout tanpa sidebar
const AuthLayout = ({ children }) => (
  <div className="auth bg-gradient-to-tr from-gray-800 via-slate-900 to-gray-800">
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute dengan layout tanpa sidebar */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterForm />
            </AuthLayout>
          }
        />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/manage/patient" element={<PatientRecord />} />
          <Route path="/manage/medical" element={<MedicalRecord />} />
          <Route path="/manage/nurse" element={<ManageNurse />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
