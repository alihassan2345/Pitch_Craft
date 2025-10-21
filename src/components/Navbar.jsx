import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Optional if using AuthContext

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth() || {}; // Optional user info from context

  const isActive = (path) =>
    location.pathname === path ? "text-yellow-400 font-semibold" : "text-white";

  return (
    <nav className="backdrop-blur-md bg-indigo-600/70 shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-6">
        
        {/* ✅ Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/images-removebg-preview.png"
            alt="PitchCraft Logo"
            className="w-10 h-10 rounded-full bg-white/80 border border-indigo-200 shadow-md group-hover:scale-110 transition-transform"
          />
          <h1 className="text-xl font-bold text-white tracking-wide group-hover:text-yellow-300 transition-colors">
            PitchCraft
          </h1>
        </Link>

        {/* ✅ Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/home"
            className={`${isActive(
              "/home"
            )} hover:text-yellow-300 transition-colors text-sm tracking-wide`}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={`${isActive(
              "/dashboard"
            )} hover:text-yellow-300 transition-colors text-sm tracking-wide`}
          >
            Dashboard
          </Link>

          {/* ✅ CTA Button */}
          <Link
            to="/create"
            className="ml-2 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg"
          >
            + New Pitch
          </Link>

          {/* ✅ Optional Logout Button */}
          {user && (
            <button
              onClick={logout}
              className="text-white border border-white/40 px-3 py-1 rounded-md hover:bg-white/10 transition-all text-sm"
            >
              Logout
            </button>
          )}
        </div>

        {/* ✅ Mobile Menu Toggle */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700/90 backdrop-blur-xl flex flex-col gap-3 py-3 px-6 text-white font-medium animate-slideDown border-t border-white/10">
          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 transition-colors"
          >
            Create
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 transition-colors"
          >
            Dashboard
          </Link>

          {user && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-red-300 border border-red-400/40 px-4 py-2 rounded-lg font-semibold hover:bg-red-400/20 transition-all"
            >
              Logout
            </button>
          )}

          <Link
            to="/create"
            onClick={() => setMenuOpen(false)}
            className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 text-center shadow-md hover:shadow-lg transition-all"
          >
            + New Pitch
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
