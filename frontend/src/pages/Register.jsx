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
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="name" value={form.name} onChange={onChange} className="w-full p-2 border" placeholder="Name" />
        <input name="email" value={form.email} onChange={onChange} className="w-full p-2 border" placeholder="Email" />
  <input name="password" value={form.password} onChange={onChange} type="password" className="w-full p-2 border" placeholder="Password" />
  <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" className="w-full p-2 border" placeholder="Confirm Password" />
  <input name="phone" value={form.phone} onChange={onChange} className="w-full p-2 border" placeholder="Phone (optional)" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}