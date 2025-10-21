import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { generatePitch } from "../../config/gemini";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); // ✅ Get current user from AuthContext

  // ✅ Fetch pitches of logged-in user only
  const fetchPitches = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "pitches"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPitches(list);
    } catch (error) {
      console.error("Error fetching pitches:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete pitch
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this pitch?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "pitches", id));
      setPitches(pitches.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting pitch:", error);
    }
  };

  // ✅ Regenerate pitch
  const handleRegenerate = async (pitch) => {
    setRegeneratingId(pitch.id);
    try {
      const newPitch = await generatePitch(pitch.idea);
      await updateDoc(doc(db, "pitches", pitch.id), { result: newPitch });
      setPitches((prev) =>
        prev.map((p) =>
          p.id === pitch.id ? { ...p, result: newPitch } : p
        )
      );
      alert("Pitch regenerated successfully ✅");
    } catch (error) {
      console.error("Error regenerating:", error);
      alert("Failed to regenerate pitch 😢");
    } finally {
      setRegeneratingId(null);
    }
  };

  useEffect(() => {
    fetchPitches();
  }, [user]); // ✅ Refetch when user changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-semibold text-xl">
        ⚙️ Loading your pitches...
      </div>
    );
  }

  // ✅ If user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-3xl font-bold mb-4">🔒 Access Restricted</h1>
        <p className="text-lg text-indigo-100 mb-6">
          Please log in to view your saved startup pitches.
        </p>
        <a
          href="/"
          className="bg-yellow-400 text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-all shadow-lg"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // ✅ Filter pitches by search
  const filteredPitches = pitches.filter((pitch) =>
    pitch.result?.startupName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-6 text-white">
        <h1 className="text-4xl font-bold text-center mb-10 drop-shadow-md">
          🧩 Your AI Startup Pitches
        </h1>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search by startup name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md bg-white/20 text-white placeholder-white/80 border border-white/30 rounded-xl p-3 focus:ring-2 focus:ring-yellow-300 focus:outline-none shadow-lg"
          />
        </div>

        {/* ✅ Empty State */}
        {filteredPitches.length === 0 ? (
          <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-2xl shadow-inner border border-white/20">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--out-of-stock-store-package-pack-e-commerce-logistics-illustrations-5164733.png"
              alt="Empty"
              className="w-40 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold mb-2">No Pitches Found 😕</h2>
            <p className="text-indigo-100 mb-6">
              Start creating your first AI-powered startup pitch now!
            </p>
            <a
              href="/create"
              className="bg-yellow-400 text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-all shadow-lg"
            >
              ⚡ Create New Pitch
            </a>
          </div>
        ) : (
          /* ✅ Pitch Cards Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Logo */}
                {pitch.imageURL && (
                  <img
                    src={pitch.imageURL}
                    alt="Logo"
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-4 border border-white/30 shadow-lg"
                  />
                )}

                {/* Startup Details */}
                <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-1">
                  {pitch.result?.startupName || "Untitled Startup"}
                </h2>
                <p className="italic text-indigo-100 text-center mb-4">
                  "{pitch.result?.tagline || "No tagline"}"
                </p>

                <div className="bg-white/10 rounded-xl p-4 text-sm text-indigo-50 shadow-inner mb-4">
                  <p className="mb-2">
                    <strong>Pitch:</strong> {pitch.result?.pitch}
                  </p>
                  <p>
                    <strong>Audience:</strong> {pitch.result?.targetAudience}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleRegenerate(pitch)}
                    disabled={regeneratingId === pitch.id}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                      regeneratingId === pitch.id
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-yellow-400 text-indigo-900 hover:bg-yellow-300"
                    }`}
                  >
                    {regeneratingId === pitch.id
                      ? "Regenerating..."
                      : "♻️ Regenerate"}
                  </button>

                  <button
                    onClick={() => handleDelete(pitch.id)}
                    className="text-red-300 hover:text-red-400 text-sm font-medium transition-all"
                  >
                    🗑 Delete
                  </button>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-indigo-100 mt-3 text-center opacity-80">
                  {pitch.createdAt?.toDate
                    ? pitch.createdAt.toDate().toLocaleString()
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
