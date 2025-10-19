import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      alert("Registration Successful 🎉");
      navigate("/home");
    } catch (err) {
      alert(err.message);
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
          Create Your Account 🧩
        </h2>
        <p className="text-center text-indigo-100 mb-6 text-sm">
          Join PitchCraft and start generating AI-powered startup ideas 🚀
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-lg p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-indigo-900 font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-all shadow-lg"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-center text-indigo-100 mt-5 text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-yellow-300 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
