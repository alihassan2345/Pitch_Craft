import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyDTOsMfUo-IznRUOdQLevnHEIKwZIKYlfk");

// ============================================================
// 🧠 1. Generate a startup pitch (JSON format)
// ============================================================
export const generatePitch = async (idea) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert startup advisor. Based on this idea:
"${idea}"

Generate a concise, creative, and structured startup pitch in valid JSON format.
Return only JSON with these keys:
{
  "startupName": "string",
  "tagline": "string",
  "pitch": "string",
  "targetAudience": "string",
  "colorPaletteIdea": "string"
}
  

`;

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini JSON Error:", error);
    return {
      startupName: "AI Startup",
      tagline: "Empowering innovation with AI",
      pitch: "Your pitch could not be generated. Try again.",
      targetAudience: "Entrepreneurs",
      colorPaletteIdea: "Blue, White, Purple",
    };
  }
};

// ============================================================
// 💻 2. Generate Landing Page HTML + CSS Code
// ============================================================
export const generateLandingPageCode = async (pitchData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are a professional web developer.
Create a **complete responsive landing page (HTML + CSS)** for this startup:

Startup Name: ${pitchData.startupName}
Tagline: ${pitchData.tagline}
Pitch: ${pitchData.pitch}
Target Audience: ${pitchData.targetAudience}
Color Palette: ${pitchData.colorPaletteIdea}

Page Requirements:
1. Fully responsive, modern design
2. Hero section with title, subtitle, and CTA button
3. Features / Benefits section
4. Problem & Solution section
5. About section
6. Call To Action / Contact section
7. Use clean, modern typography
8. Add smooth hover animations & transitions
9. Use inline <style> CSS inside the same HTML file
10. Return ONLY HTML code — no markdown or explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    let code = await result.response.text();
    // Clean markdown formatting
    code = code.replace(/```html|```/g, "").trim();
    return code;
  } catch (error) {
    console.error("Gemini HTML Error:", error);
    return "<h1>Failed to generate landing page. Please try again.</h1>";
  }
};
