import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-10">
        {/* Left Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 leading-tight mb-4 animate-fadeIn">
             PitchCraft
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-lg mb-8 animate-fadeIn delay-100">
            Transform your startup ideas into investor-ready AI-powered pitches.
            Let <span className="text-indigo-600 font-semibold">Gemini AI</span> 
            bring your vision to life!
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 animate-fadeIn delay-200">
            <button
              onClick={() => navigate("/create")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105 duration-200"
            >
              ⚡ Get Started
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-7 py-3 rounded-xl font-semibold shadow-sm hover:bg-indigo-50 transition-transform transform hover:scale-105 duration-200"
            >
              📂 View Dashboard
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="public/images-removebg-preview.png"
            alt="AI Pitch"
            className="w-72 md:w-96 drop-shadow-2xl animate-float"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-12">
          💡 Why Choose PitchCraft?
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Ideas",
              desc: "Generate startup names, taglines, and investor-ready pitches using Gemini AI.",
              icon: "💡",
            },
            {
              title: "Instant Generation",
              desc: "Create complete pitch content in seconds with a single click.",
              icon: "⚡",
            },
            {
              title: "Save & Export",
              desc: "Store your ideas securely and export them into beautiful PDFs instantly.",
              icon: "☁️",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-indigo-50 to-white shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-indigo-500 rounded-2xl p-6 text-center transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} PitchCraft AI — Crafted with ❤️ by Ali Hassan
        </p>
      </footer>
    </div>
  );
};

export default Home;
