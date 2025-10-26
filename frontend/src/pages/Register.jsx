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
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h2 className="text-2xl mb-4 font-semibold">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} className="w-full p-2 border rounded" placeholder="Full name" />
          <input name="email" value={form.email} onChange={onChange} className="w-full p-2 border rounded" placeholder="Email" />
          <input name="password" value={form.password} onChange={onChange} type="password" className="w-full p-2 border rounded" placeholder="Password" />
          <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" className="w-full p-2 border rounded" placeholder="Confirm password" />
          <input name="phone" value={form.phone} onChange={onChange} className="w-full p-2 border rounded" placeholder="Phone (optional)" />
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">Register</button>
        </form>
        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      </div>
    </div>
  );
}