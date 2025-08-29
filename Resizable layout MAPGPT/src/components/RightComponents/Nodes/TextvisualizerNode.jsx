import { Handle, Position } from "@xyflow/react";
import { Eye } from "lucide-react";
import { useScrollStore } from "../../../store/useScrollStore";

const TextVisualizer = ({ id, data }) => {
  const setScrollToId = useScrollStore((state) => state.setScrollToId);

  return (
    <div
      className="w-full max-w-[672px] rounded-xl font-sans shadow-xl relative bg-black/60 backdrop-blur-md border border-white/20 hover:border-blue-400 hover:border-4 transition-colors duration-300 overflow-hidden"
      style={{ fontSize: "0.85rem" }} // Reduce font size by 15%
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ width: 15, height: 15, background: "#888", borderRadius: "50%" }}
        isConnectable
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ width: 15, height: 15, background: "#888", borderRadius: "50%" }}
        isConnectable
      />

      {/* Content */}
      <div className="flex items-center gap-2 p-2">
        {/* Eye Icon (centered & fixed size) */}
        <Eye
          className="ml-7 my-5 w-10 h-10 flex-shrink-0 text-gray-300 cursor-pointer hover:text-blue-400 transition-colors"
          onClick={() => setScrollToId(id)}
        />

        {/* Question Text */}
        <h1
          className="mr-5 text-sm font-normal text-gray-200 leading-snug break-words whitespace-pre-wrap m-2"
          title={data?.question}
        >
          {data?.question}
        </h1>
      </div>
    </div>
  );
};

export default TextVisualizer;
