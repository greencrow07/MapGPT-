import axios from "axios";
import { useEffect, useState } from "react";
import { sendToGroq } from "./services/groqApi";
import { useNavigate } from "react-router-dom";

export default function PostLogin() {
  const navigate = useNavigate();
  const [pendingquery, setPendingQuery] = useState(
    localStorage.getItem("pendingQuery")
  );

  useEffect(() => {
    const handlePostLogin = async () => {
      try {
        const ans = await sendToGroq(pendingquery);
        const resUser = await axios.get("/auth/user");

        const resChat = await axios.post("/flow/createFlow", {
          question: pendingquery,
          answer: ans,
        });

        if (resChat.status === 201) {
          const flowId = resChat.data.flowId; // match backend key
          navigate(`/flow/${flowId}`);
        }
      } catch (err) {
        console.error("Error creating chat:", err);
        // Handle error appropriately, maybe redirect to login or show error message
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    if (pendingquery) {
      handlePostLogin();
    } else {
      // If there's no pending query, redirect to landing page
      navigate("/");
    }
  }, [pendingquery, navigate]);

  return (
    <>
      <h1>Creating your chat, please wait...</h1>
      <p>Is your Query: "{pendingquery}"?</p>
    </>
  );
}
