import { useState } from "react";
import { postJSON } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({email:"", password:""});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/login", form);
    setMsg(res.message || JSON.stringify(res));
    if (res.success && res.access) {
      localStorage.setItem("access", res.access);
      if (res.refresh) localStorage.setItem("refresh", res.refresh);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h2 className="text-3xl mb-6 font-bold text-center text-blue-600">Welcome Back</h2>
        <form onSubmit={submit} className="space-y-6">
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
              placeholder="Enter your password" 
            />
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Sign In
          </button>
        </form>
        {msg && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{msg}</p>}
      </div>
    </div>
  );
}