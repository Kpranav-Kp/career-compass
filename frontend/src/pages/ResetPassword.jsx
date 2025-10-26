import { useState } from "react";
import { postJSON } from "../api";
import { useLocation } from "react-router-dom";

function useQuery(){ return new URLSearchParams(useLocation().search); }

export default function ResetPassword(){
  const q = useQuery();
  const userId = q.get("id");
  const token = q.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async e => {
    e.preventDefault();
    const res = await postJSON("/resetPassword", { id: userId, token, password });
    setMsg(res.message || JSON.stringify(res));
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-4">Reset Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full p-2 border" placeholder="New password" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Reset password</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}