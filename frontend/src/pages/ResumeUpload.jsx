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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload Resume</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role (optional)</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Engineer" className="mt-1 block w-full border p-2 rounded" />
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

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Result</h3>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
