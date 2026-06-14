import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Building2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2433] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl mb-4"><Building2 size={32} className="text-white" /></div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Staysync</h1>
          <p className="text-[#64748b] mt-1">Sign in to your account</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="admin@hostel.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1e293b] mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f1f5f9] border border-[#cbd5e1] rounded-lg text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-medium text-white transition">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
