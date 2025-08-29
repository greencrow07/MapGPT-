import { useState, useRef, useEffect } from "react";
import { ArrowUp, X, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { sendToGroq } from "../../services/groqApi";
import useQueryStore from "../../store/useQueryStore";

export default function CollapsibleSearchBar({
  isOpen,
  setIsOpen,
  value,
  setValue,
  inputRef,
  handleAddNode,
  nodes
}) {
  const [contextMode, setContextMode] = useState("Full Context");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Zustand query store
  const { queryData, clearQuery } = useQueryStore();

  const toggleExpansion = () => setIsOpen(!isOpen);

  // Persistent conversation memory
  const conversationRef = useRef([]);

  // ✅ Focus input when bar opens
  

  useEffect(() => {
  const handleGlobalKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // Ignore shortcuts
    if (isOpen) return; // Already open, don't intercept

    const isLetter = /^[a-zA-Z]$/.test(e.key);
    const isDigit = /^[0-9]$/.test(e.key);
    const isSpace = e.key === " ";

    if (isLetter || isDigit || isSpace) {
      setIsOpen(true);
      setValue(e.key); // 👈 insert the first typed key

      setTimeout(() => {
        inputRef.current?.focus();
        // put cursor at end
        inputRef.current?.setSelectionRange(1, 1);
      }, 0);
    }
  };

  window.addEventListener("keydown", handleGlobalKeyDown);
  return () => {
    window.removeEventListener("keydown", handleGlobalKeyDown);
  };
}, [isOpen, setIsOpen, setValue, inputRef]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(value);
    }
  };

  const handleSubmit = async (input) => {
    toggleExpansion();
    if (!input.trim()) return;

    // Push user message to memory immediately
    conversationRef.current.push({ role: "user", content: input });

    // Build messages for API depending on contextMode
    let messages = [
      {
        role: "system",
        content:
          "You are a friendly, conversational AI assistant. Always remember the prior messages in this conversation and respond as if continuing the same chat."
      }
    ];

    if (contextMode === "Full Context") {
      messages = [...messages, ...conversationRef.current];
    } else if (contextMode === "Previous Context") {
      const last = conversationRef.current.slice(-2);
      messages = [...messages, ...last];
    } else if (contextMode === "No Context") {
      messages = [...messages, { role: "user", content: input }];
    } else if (contextMode === "Last N Questions Context") {
      const lastN = conversationRef.current.slice(-6);
      messages = [...messages, ...lastN];
    }

    // Send to Groq
    const answer = await sendToGroq(messages);

    // Push assistant reply to memory
    conversationRef.current.push({ role: "assistant", content: answer });

    // Update UI with new node (parent is derived from store)
    handleAddNode({ value: input, answer: answer, tag: null });

    // Clear input
    setValue("");
  };

  return (
    <div className="absolute bottom-0 w-full px-4 pr-10 pb-4 z-20 pr-6">
      {/* Query chip shown above search bar if query exists */}
      {queryData && (
        <div className="mb-3 flex justify-center">
          <div className="w-full max-w-[768px] border border-[#424242] rounded-2xl bg-[#3a3a3a] px-4 py-3 flex items-center justify-between shadow-md">
            <span className="text-white text-base leading-snug break-words pr-2">
              {queryData.query}
            </span>
            <button
              className="p-1 hover:bg-gray-600 rounded-full flex-shrink-0"
              onClick={clearQuery}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="w-full flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            key="expanded-container"
          >
            <div className="w-full max-w-[768px] border border-[#424242] rounded-3xl bg-[#303030]">
              <TextareaAutosize
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything"
                className="placeholder:text-lg text-lg p-2 mt-3 ml-3 w-[95%] overflow-hidden outline-none focus:outline-none rounded resize-none"
                maxRows={10}
              />
              <div className="p-3 pt-1 pb-1 m-2 mt-0 rounded-lg flex justify-between items-center">
                {/* Collapse Button */}
                <button
                  className="-ml-2 p-1 rounded-full border"
                  onClick={toggleExpansion}
                >
                  <X className="w-6 h-5" />
                </button>

                {/* Context Dropdown */}
                <div className="relative">
                  <button
                    className="bg-white text-black px-3 py-1.5 rounded-full shadow flex items-center gap-2 hover:bg-gray-100 transition text-sm"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {contextMode}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg w-56 text-black z-30">
                      {[
                        "Full Context",
                        "Previous Context",
                        "No Context",
                        "Last N Questions Context"
                      ].map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            setContextMode(option);
                            setDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className="bg-white p-1 rounded-full"
                  onClick={() => handleSubmit(value)}
                >
                  <ArrowUp className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex justify-start items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="collapsed-container"
          >
            <motion.button
              className="flex justify-center items-center w-12 h-12 rounded-full bg-[#303030] border border-[#424242]"
              onClick={toggleExpansion}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
