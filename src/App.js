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

// Layout dengan sidebar
const MainLayout = ({ children }) => (
  <div className="App">
    <Sidebar />
    <div className="content">
      <Outlet /> {/* Gunakan Outlet di sini */}
    </div>
  </div>
);

// Layout tanpa sidebar
const AuthLayout = ({ children }) => <div className="auth">{children}</div>;

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
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage/patient" element={<PatientRecord />} />
          <Route path="/manage/medical" element={<MedicalRecord />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
