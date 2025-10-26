import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResumeUpload from "./pages/ResumeUpload";
import Landing from "./pages/Landing";
import BackgroundWrapper from "./components/BackgroundWrapper";

function Nav() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    setToken(localStorage.getItem("access"));
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    navigate("/");
  };

  if (isLandingPage && !token) return null;

  return (
    <nav className="sticky top-0 p-4 bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-between z-50">
      <div className="space-x-4">
        <Link className="font-semibold text-xl text-blue-600" to="/">Career Compass</Link>
      </div>
      <div className="space-x-4">
        {!token ? (
          <>
            <Link className="px-4 py-2 rounded-full hover:bg-gray-100" to="/register">Register</Link>
            <Link className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700" to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link className="px-4 py-2 rounded-full hover:bg-gray-100" to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="px-4 py-2 text-red-600 rounded-full hover:bg-red-50">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundWrapper>
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
      </BackgroundWrapper>
    </BrowserRouter>
  );
}