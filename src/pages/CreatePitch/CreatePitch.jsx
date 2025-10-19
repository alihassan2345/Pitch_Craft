import React, { useState } from "react";
import { generatePitch } from "../../config/gemini";
import { db, auth } from "../../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../../config/cloudinary";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CreatePitch = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const url = await uploadToCloudinary(file);
    setImageURL(url);
  };

  // ✅ Handle pitch generation
  const handleGeneratePitch = async () => {
    if (!idea.trim()) {
      alert("Please enter your startup idea first!");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await generatePitch(idea);
      setResult(response);

      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "pitches"), {
          userId: user.uid,
          idea,
          result: response,
          imageURL,
          createdAt: Timestamp.now(),
        });
      }

      navigate("/export", { state: { pitch: response } });
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate pitch. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <Navbar />
      <div className="flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-gray-100 animate-fadeIn">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
            🎯 Create Your AI Startup Pitch
          </h1>

          {/* Input Area */}
          <label className="block text-gray-700 font-medium mb-2">
            Describe Your Idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none transition-all"
            rows="5"
            placeholder="e.g. An app that connects students with mentors"
          />

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Your Startup Logo (optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {imageURL && (
                <img
                  src={imageURL}
                  alt="uploaded"
                  className="w-20 h-20 rounded-lg object-cover shadow-md border"
                />
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePitch}
            disabled={loading}
            className={`mt-8 w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? "⚙️ Generating..." : "⚡ Generate Pitch"}
          </button>

          {/* Result Display */}
          {result && (
            <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-inner animate-fadeUp">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
                ✨ AI Generated Pitch
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>🏢 Startup Name:</strong> {result.startupName}
                </p>
                <p>
                  <strong>💬 Tagline:</strong> {result.tagline}
                </p>
                <p>
                  <strong>🎯 Pitch:</strong> {result.pitch}
                </p>
                <p>
                  <strong>👥 Target Audience:</strong> {result.targetAudience}
                </p>
                <p>
                  <strong>🎨 Color Palette:</strong> {result.colorPaletteIdea}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePitch;
