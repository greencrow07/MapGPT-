import { use, useState } from "react"
import axios from "axios";
import { useEffect } from "react";
import { motion } from "framer-motion";

const letters = "Goooogle".split("");

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const bounceIn = {
  hidden: { y: -50, scale: 0, opacity: 0 },
  show: {
    y: [0, -20, 0],
    scale: [1, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};



export default function Login(){
    const [loggedIn, setLoggedIn] = useState(false); 
    const [message, setMessage] = useState(null); 
    // send a get req at /auth/user to check is the user is logged in 
    const baseUrl = import.meta.env.VITE_BACKEND_URL
  
    
    const handleAuth = () => {
        if(!loggedIn) 
            handleLogin(); 
        else 
            handleLogout(); 
    }
    const handleLogin = () => {
        window.location.href = `${baseUrl}/auth/google`
    }
    const handleLogout = () => {
        window.location.href = `${baseUrl}/auth/logout`
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center">
  <div className="  rounded-xl px-10 py-8 shadow-lg flex flex-col items-center min-w-[320px]">
    <h2 className="fixed top-[100px]    font-semibold text-4xl">come on bro , login first</h2>
    <img
      src="https://m.media-amazon.com/images/I/51xS+trE58L.jpg"
      className=" mb-6 rounded-full"
    />
    <button
      onClick={handleLogin}
      className="flex items-center gap-3  border border-gray-300 rounded-md px-6 py-2 text-base font-medium cursor-pointer shadow-sm hover:shadow-md transition"
    >
      <svg width="24" height="24" viewBox="0 0 48 48">
        <g>
          <path
            fill="#4285F4"
            d="M43.6 20.5h-1.9V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-3.5z"
          />
        </g>
      </svg>
      Login with 
      <span>
        <p style={{ fontSize: "3rem", display: "flex", gap: "0.2rem" }}>
      <motion.span variants={container} initial="hidden" animate="show">
        {letters.map((char, i) => (
          <motion.span key={i} variants={bounceIn}>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </p>
      </span>
    </button>
  </div>
</div>

    );
}