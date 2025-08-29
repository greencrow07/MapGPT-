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
          userId: resUser.data._id,
        });

        if (resChat.status === 201) {
          const flowId = resChat.data.flowId; // match backend key
          navigate(`/flow/${flowId}`);
        }
      } catch (err) {
        console.error("Error creating chat:", err);
      }
    };

    if (pendingquery) {
      handlePostLogin();
    }
  }, [pendingquery, navigate]);

  return (
    <>
      <h1>Creating your chat, please wait...</h1>
      <p>Is your Query: "{pendingquery}"?</p>
    </>
  );
}
