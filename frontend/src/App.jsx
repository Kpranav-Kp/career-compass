import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResumeUpload from "./pages/ResumeUpload";
import Landing from "./pages/Landing";

function Nav() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("access"));
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className="p-4 bg-gray-100 flex items-center justify-between">
      <div className="space-x-4">
        <Link className="font-semibold" to="/">Career Compass</Link>
      </div>
      <div className="space-x-4">
        {!token ? (
          <>
            <Link className="mr-4" to="/register">Register</Link>
            <Link className="mr-4" to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link className="mr-4" to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />

      <div className="p-6">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ResumeUpload />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}