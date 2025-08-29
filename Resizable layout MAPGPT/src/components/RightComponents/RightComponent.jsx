import TextVisualizer from "./Nodes/TextvisualizerNode";
import { Background, ReactFlow, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function RightComponent({ nodes, onNodesChange, onEdgesChange, edges, nodeTypes, onConnect }) {
  const fallbackNodeTypes = nodeTypes || { customNode: TextVisualizer, text: TextVisualizer };


  return (
    <div className="flex-[2] text-red-500  overflow-auto">
      <div className=" h-[100%] w-[100%]">
      <ReactFlow
  nodes={nodes}
  onNodesChange={onNodesChange}
  nodeTypes={fallbackNodeTypes}
  onEdgesChange={onEdgesChange}
  edges={edges}
  onConnect={onConnect}
  fitView
  
  
  onInit={(instance) => {
    instance.setViewport({ x: 0, y: 0, zoom: 0.5 });
  }}
  panOnScroll={false}
  zoomOnScroll
  panOnDrag
/>

        {/* <Background variant="lines" gap={30} size={5} color="orange" /> */}
      </div>
    </div>
  );
}
