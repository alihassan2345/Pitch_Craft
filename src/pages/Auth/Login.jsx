import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful 🎯");
      navigate("/home");
    } catch (err) {
      alert("Invalid email or password 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        
        {/* App Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv-KAZe4jMILjofueb0l8tQhsXNJrqT6BZxw&s"
            alt="PitchCraft Logo"
            className="w-16 h-16 rounded-full bg-white/80 shadow-md object-cover border border-indigo-200"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-indigo-100 mb-6 text-sm">
          Login to continue your PitchCraft journey 🚀
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-indigo-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-all shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-indigo-100 mt-5 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
