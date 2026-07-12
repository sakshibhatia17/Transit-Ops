import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("token", "demo");
    navigate("/dashboard");
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
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#22577A] text-white py-3 rounded-lg hover:bg-[#1A4761] transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;