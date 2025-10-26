import { useState } from "react";
import { postJSON } from "../api";

export default function ForgotPassword(){
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/forgotPassword", { email });
    setMsg(res.message || JSON.stringify(res));
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Forgot Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border" placeholder="Email" />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">Send reset link</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}