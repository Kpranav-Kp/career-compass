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
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input name="email" value={form.email} onChange={onChange} className="w-full p-2 border" placeholder="Email" />
        <input name="password" value={form.password} onChange={onChange} type="password" className="w-full p-2 border" placeholder="Password" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}