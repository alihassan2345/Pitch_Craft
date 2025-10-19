import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-yellow-300" : "text-white";

  return (
    <nav className="bg-indigo-600 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-6">
        
        {/* ✅ Logo Section */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="public/images-removebg-preview.png"
            alt="PitchCraft Logo"
            className="w-10 h-10 rounded-full shadow-md bg-white object-cover border border-indigo-200"
          />
          <h1 className="text-xl font-bold text-white tracking-wide">
            PitchCraft
          </h1>
        </Link>

        {/* ✅ Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/home"
            className={`${isActive("/home")} hover:text-yellow-300 transition-colors font-medium`}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={`${isActive("/dashboard")} hover:text-yellow-300 transition-colors font-medium`}
          >
            Dashboard
          </Link>

          {/* ✅ CTA Button */}
          <Link
            to="/create"
            className="ml-4 bg-yellow-400 text-indigo-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg"
          >
            + New Pitch
          </Link>
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700 flex flex-col gap-3 py-3 px-6 text-white font-medium animate-slideDown">
          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            Home
          </Link>

          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            Create
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300"
          >
            Dashboard
          </Link>

          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className="bg-yellow-400 text-indigo-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 text-center"
          >
            + New Pitch
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
