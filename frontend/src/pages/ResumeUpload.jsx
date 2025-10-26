import { useState } from "react";
import { postForm } from "../api";
import { useNavigate } from "react-router-dom";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const onFileChange = (e) => setFile(e.target.files[0]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file.");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("role", role);

    setLoading(true);
    try {
      // include Authorization header if token present
      const token = localStorage.getItem("access");
      const res = await fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:8000/api/extract-skills"}/`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ status: "error", message: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex gap-2 items-center">
          <button onClick={() => navigate('/profile')} className="px-3 py-1 border rounded">Profile</button>
          <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="text-lg font-medium mb-4">Upload Resume</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role (optional)</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Data Scientist" className="mt-1 block w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={onFileChange} className="mt-1" />
          </div>

          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? "Uploading..." : "Upload & Extract"}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="mt-6 bg-white shadow rounded p-4">
          <h3 className="font-semibold">Extraction Result</h3>
          <div className="mt-3">
            <p><strong>Role:</strong> {result.data?.role || '—'}</p>
            <div className="mt-2">
              <p className="font-medium">Extracted skills</p>
              {result.extracted_skills && result.extracted_skills.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.extracted_skills.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No skills extracted from resume text.</p>
              )}
            </div>

            <div className="mt-4">
              <p className="font-medium">Recommended skills</p>
              {result.recommended_skills && result.recommended_skills.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.recommended_skills.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No recommendations available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
