import { useState } from "react";
import { postJSON } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form, setForm] = useState({name:"", email:"", password:"", confirmPassword:"", phone:""});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    // send only fields expected by backend
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    };
    const res = await postJSON("/register", payload);
    setMsg(res.message || JSON.stringify(res));
    if (res.success) {
      // Redirect to login on successful registration
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h2 className="text-3xl mb-6 font-bold text-center text-blue-600">Create Account</h2>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter your full name" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={onChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter your email" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              value={form.password} 
              onChange={onChange} 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Create a password" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={onChange} 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Confirm your password" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={onChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter your phone number" 
            />
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Create Account
          </button>
        </form>
        {msg && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{msg}</p>}
      </div>
    </div>
  );
}