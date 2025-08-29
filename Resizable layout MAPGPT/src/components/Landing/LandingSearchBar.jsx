import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LandingSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
  if (!query.trim()) return;

  // Save to localStorage
  localStorage.setItem("pendingQuery", query.trim());

  try {
    const res = await axios.get("/auth/user"); // baseURL & credentials already applied

    if (res.status === 200) {
      navigate("/post-login");
    } else {
      navigate("/login");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
    } else {
      console.error("Error checking login status:", error);
      navigate("/login");
    }
  }

  setQuery("");
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-[1200px] max-w-[90%] h-[20vh] mt-6 p-2">
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:blur-sm transition-all duration-300 group-hover:opacity-70" />
        <div className="h-[15vh] relative rounded-2xl bg-zinc-900 text-white flex items-center px-4 py-3 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search chats or ask something..."
            className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            onClick={handleSearch}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LandingSearchBar;
