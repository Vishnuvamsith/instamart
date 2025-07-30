import React, { useState, useEffect } from "react";
import { FaSmile, FaMeh, FaFrown, FaAngry } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const emojis = [
  { icon: <FaSmile />, label: "happy", color: "text-green-500" },
  { icon: <FaMeh />, label: "neutral", color: "text-yellow-500" },
  { icon: <FaFrown />, label: "sad", color: "text-orange-500" },
  { icon: <FaAngry />, label: "angry", color: "text-red-500" },
];

const MoodCheckin = () => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      setUserInfo({
        name: decoded.name || decoded.Phone_number || "anonymous",
      });
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      await axios.post("http://localhost:5020/api/addMood", {
        user: userInfo.name,
        mood: selected,
        feedback: (selected === "sad" || selected === "angry") ? feedback : null,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to submit mood:", err);
    }
    navigate("/chat");
  };

  const handleSkip = () => {
    navigate("/chat");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("How are you feeling today?")}</h2>

        <div className="flex justify-center gap-6 text-5xl mb-6">
          {emojis.map((e) => (
            <button
              key={e.label}
              onClick={() => setSelected(e.label)}
              className={`transition-all transform hover:scale-110 p-2 rounded-full border-2 ${
                selected === e.label ? "border-indigo-600" : "border-transparent"
              } ${e.color}`}
            >
              {e.icon}
            </button>
          ))}
        </div>

        {(selected === "sad" || selected === "angry") && (
          <textarea
            placeholder={t("Would you like to tell us why?")}
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-4 py-2 text-white rounded-xl shadow-md transition ${
              selected
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {t("Submit")}
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2 border border-gray-400 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            {t("Skip")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckin;
