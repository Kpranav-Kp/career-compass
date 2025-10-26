import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Career Compass</h1>
      <p className="text-lg text-gray-700 mb-6">
        Upload your resume and receive tailored skill recommendations and
        suggestions to improve your profile. Built with Django (backend) and
        React + Tailwind (frontend).
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded">
          Register
        </Link>
        <Link to="/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded">
          Login
        </Link>
      </div>

      <section className="mt-12 text-left bg-gray-50 p-6 rounded">
        <h2 className="text-2xl font-semibold mb-2">How it works</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>Register or login to your account.</li>
          <li>Upload your resume (PDF).</li>
          <li>Our model extracts skills and recommends additional skills based on the role.</li>
          <li>View and download suggested skills for improving your profile.</li>
        </ol>
      </section>
    </div>
  );
}
