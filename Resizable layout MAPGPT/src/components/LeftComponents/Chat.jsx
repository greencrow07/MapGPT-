import { useState, useRef, useEffect } from "react";
import useQueryStore from "../../store/useQueryStore";
import { useScrollStore } from "../../store/useScrollStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function ChatComponent({ nodes = [] }) {
  const { setQuery } = useQueryStore();
  // const { scrollToId } = useScrollStore();
  const scrollToId = useScrollStore((state) => state.scrollToId);


  const [selection, setSelection] = useState(null); // { text, x, y, parentId }
  const containerRef = useRef(null);

  // ✅ scroll to node whenever scrollToId changes
  useEffect(() => {
    if (scrollToId && containerRef.current) {
      const el = containerRef.current.querySelector(
        `[data-node-id="${scrollToId}"]`
      );
      if (el) {
        const container = containerRef.current;
        const elTop = el.offsetTop;
        // scroll with offset (20px from top)
        container.scrollTo({
          top: elTop - 20,
          behavior: "smooth",
        });
      }
    }
  }, [scrollToId]);

  // ✅ text selection logic
  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection().toString().trim();
      if (!selectedText) {
        setSelection(null);
        return;
      }

      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Find parent node id by walking DOM up
      const answerEl =
        range.startContainer?.parentElement?.closest("[data-node-id]");
      const parentId = answerEl?.getAttribute("data-node-id");

      if (parentId) {
        const containerRect = containerRef.current.getBoundingClientRect();

        setSelection({
          text: selectedText,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 40,
          parentId,
        });
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleAsk = () => {
    if (selection?.text && selection?.parentId) {
      setQuery({ query: selection.text, parentId: selection.parentId });
      setSelection(null);
    }
  };

  if (!nodes.length) {
    return <div className="text-gray-500 p-4">No messages yet</div>;
  }

  return (
    <div
      ref={containerRef}
      className="custom-scroll w-full p-6 space-y-6 h-screen overflow-y-auto relative"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#555 #0d0d0d",
      }}
    >
      <style>
        {`
          .custom-scroll::-webkit-scrollbar { width: 6px; }
          .custom-scroll::-webkit-scrollbar-track { background: #0d0d0d; }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 9999px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover { background: #777; }

          .markdown-body {
            word-break: break-word;
          }
          .markdown-body pre {
            background: #1e1e1e;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            max-width: 100%;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .markdown-body code {
            background: #2d2d2d;
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 0.9rem;
            color: #ffb86c;
            word-break: break-word;
            white-space: pre-wrap;
          }
        `}
      </style>

      {nodes.map((node, index) => (
        <div key={index} className="space-y-3 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            {/* User question bubble */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-4 rounded-2xl max-w-md w-fit shadow-lg text-base leading-relaxed font-medium mb-5">
                {node.data.question}
              </div>
            </div>

            {/* Bot answer bubble */}
            <div className="flex justify-start">
              <div
                className="bg-[#1a1a1a] text-gray-200 p-5 rounded-2xl max-w-2xl w-fit shadow-lg text-[15px] leading-relaxed space-y-4 markdown-body"
                data-node-id={node.id}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {node.data.answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pb-40"></div>

      {selection && (
        <button
          onClick={handleAsk}
          className="absolute bg-blue-600 text-white px-3 py-1 rounded-full shadow-md text-sm"
          style={{
            top: selection.y + containerRef.current.scrollTop,
            left: selection.x - 30,
          }}
        >
          Ask
        </button>
      )}
    </div>
  );
}
