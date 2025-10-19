import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { generatePitch } from "../../config/gemini";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState(null);

  // ✅ Fetch all pitches
  const fetchPitches = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pitches"));
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-white text-indigo-600 font-semibold text-xl">
        ⚙️ Loading your pitches...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center mb-10">
          🧩 Your Saved Pitches
        </h1>

        {pitches.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--out-of-stock-store-package-pack-e-commerce-logistics-illustrations-5164733.png"
              alt="Empty"
              className="w-48 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Pitches Found 😕
            </h2>
            <p className="text-gray-500 mb-6">
              Start creating your first AI-powered startup pitch now!
            </p>
            <a
              href="/create"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              ⚡ Create New Pitch
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pitches.map((pitch) => (
              <div
                key={pitch.id}
                className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between"
              >
                {/* Image */}
                {pitch.imageURL && (
                  <img
                    src={pitch.imageURL}
                    alt="Logo"
                    className="w-20 h-20 object-cover rounded-lg mx-auto mb-4 shadow-sm"
                  />
                )}

                {/* Details */}
                <div>
                  <h2 className="text-xl font-bold text-indigo-600 mb-2 text-center">
                    {pitch.result?.startupName || "Untitled Startup"}
                  </h2>
                  <p className="text-sm italic text-gray-500 text-center mb-3">
                    "{pitch.result?.tagline || "No tagline"}"
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Pitch:</strong> {pitch.result?.pitch}
                  </p>
                  <p className="text-gray-700 text-sm mb-4">
                    <strong>Audience:</strong> {pitch.result?.targetAudience}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleRegenerate(pitch)}
                    disabled={regeneratingId === pitch.id}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all ${
                      regeneratingId === pitch.id
                        ? "bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {regeneratingId === pitch.id
                      ? "Regenerating..."
                      : "♻️ Regenerate"}
                  </button>

                  <button
                    onClick={() => handleDelete(pitch.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    🗑 Delete
                  </button>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-3 text-center">
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
