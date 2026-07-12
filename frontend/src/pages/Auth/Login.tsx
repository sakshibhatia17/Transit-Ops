import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../api/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    setLoading(true);

    const response = await login(email, password);

    localStorage.setItem("token", response.data.token);

    navigate("/dashboard");
  } catch (error) {
    alert("Invalid email or password");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-[#22577A] mb-6">
          TransitOps
        </h1>

        <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border rounded-lg p-3 mb-4"
/>

        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border rounded-lg p-3 mb-6"
/>

        <button
  onClick={handleLogin}
  className="w-full bg-[#22577A] text-white py-3 rounded-lg hover:bg-[#1A4761] transition"
>
  {loading ? "Logging in..." : "Login"}
</button>
      </div>
    </div>
  );
}

export default Login;