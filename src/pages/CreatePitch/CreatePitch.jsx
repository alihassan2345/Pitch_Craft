import React, { useState } from "react";
import { generatePitch, generateLandingPageCode } from "../../config/gemini";
import { db } from "../../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../../config/cloudinary";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const CreatePitch = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewHTML, setPreviewHTML] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(result)
  console.log(previewHTML)


  // ✅ Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageURL(url);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Generate AI Pitch
  const handleGeneratePitch = async () => {
    if (!idea.trim()) return alert("Please enter your startup idea!");
    if (!user) {
      alert("You must be logged in to create a pitch.");
      navigate("/");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const aiPitch = await generatePitch(idea);
      setResult(aiPitch);

      await addDoc(collection(db, "pitches"), {
        userId: user.uid,
        idea,
        result: aiPitch,
        imageURL,
        createdAt: Timestamp.now(),
      });

      alert("🎉 Pitch generated successfully!");
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate pitch!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ View Landing Page (Modal Preview)
  const handleViewLandingPage = async () => {
    if (!result) return alert("Generate a pitch first!");
    setHtmlLoading(true);
    try {
      const htmlCode = await generateLandingPageCode(result);
      setPreviewHTML(htmlCode);
      setShowPreview(true);
    } catch (error) {
      console.error("Web View Error:", error);
      alert("Failed to generate landing page!");
    } finally {
      setHtmlLoading(false);
    }
  };

  // ✅ Download Landing Page HTML
  const handleDownloadHTML = async () => {
    if (!result) return alert("Generate a pitch first!");
    setHtmlLoading(true);
    try {
      const htmlCode = await generateLandingPageCode(result);
      const blob = new Blob([htmlCode], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${result.startupName.replace(/\s+/g, "_")}_LandingPage.html`;
      link.click();
    } catch (error) {
      console.error("Download Error:", error);
      alert("Failed to download file!");
    } finally {
      setHtmlLoading(false);
    }
  };

  // ✅ If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white text-center px-6">
        <h1 className="text-3xl font-bold mb-4">🔒 Login Required</h1>
        <p className="text-lg text-indigo-100 mb-6">
          Please log in to create your AI-powered startup pitch.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white relative overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20 animate-fadeIn">
          <h1 className="text-3xl font-bold text-center text-yellow-300 mb-8 drop-shadow-md">
            🎯 Create Your AI Startup Pitch
          </h1>

          {/* Idea Input */}
          <label className="block text-white font-medium mb-2">
            Describe Your Startup Idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-xl p-4 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm resize-none transition-all"
            rows="5"
            placeholder="e.g. A platform connecting mentors with students"
          />

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">
              Upload Your Startup Logo (optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-white border border-white/30 rounded-lg cursor-pointer p-2 bg-white/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              {uploading ? (
                <p className="text-sm text-yellow-300 animate-pulse">Uploading...</p>
              ) : (
                imageURL && (
                  <img
                    src={imageURL}
                    alt="uploaded"
                    className="w-20 h-20 rounded-lg object-cover shadow-md border border-white/30"
                  />
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleGeneratePitch}
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 text-indigo-900 hover:bg-yellow-300 hover:scale-[1.02]"
              }`}
            >
              {loading ? "⚙️ Generating..." : "⚡ Generate Pitch"}
            </button>

            {result && (
              <>
                <button
                  onClick={handleViewLandingPage}
                  disabled={htmlLoading}
                  className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
                    htmlLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]"
                  }`}
                >
                  {htmlLoading ? "🌐 Generating..." : "🌐 View Landing Page"}
                </button>

                <button
                  onClick={handleDownloadHTML}
                  disabled={htmlLoading}
                  className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
                    htmlLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-400 text-indigo-900 hover:bg-green-300 hover:scale-[1.02]"
                  }`}
                >
                  💾 Download HTML
                </button>
              </>
            )}
          </div>

          {/* Preview Section */}
          {result && (
            <div className="mt-10 bg-white/10 border border-white/20 rounded-2xl p-6 shadow-inner animate-fadeUp">
              <h2 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">
                ✨ AI Generated Pitch Preview
              </h2>
              <div className="space-y-2 text-indigo-100">
                <p><strong>🏢 Startup Name:</strong> {result.startupName}</p>
                <p><strong>💬 Tagline:</strong> {result.tagline}</p>
                <p><strong>🎯 Pitch:</strong> {result.pitch}</p>
                <p><strong>👥 Audience:</strong> {result.targetAudience}</p>
                <p><strong>🎨 Color Palette:</strong> {result.colorPaletteIdea}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🌐 Web Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="relative bg-white w-full max-w-5xl h-[80vh] rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
            >
              ✕
            </button>
            <iframe
              srcDoc={previewHTML}
              title="AI Landing Page Preview"
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePitch;
