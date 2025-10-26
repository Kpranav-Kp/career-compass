import { useState } from "react";
import { postJSON } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form, setForm] = useState({name:"", email:"", password:""});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/register", form);
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}