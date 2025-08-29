import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  SmoothStepEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { MessageCircle, Map, Layout } from "lucide-react"; // icons

import LeftComponent from "./LeftComponents/LeftComponent";
import RightComponent from "./RightComponents/RightComponent";
import TextVisualizer from "./RightComponents/Nodes/TextvisualizerNode";
import { useScrollStore } from "../store/useScrollStore";
import useParentIdStore from "../store/useParentIdStore";
import dagre from "dagre";

const nodeTypes = { customNode: TextVisualizer, text: TextVisualizer };

const ResizableLayout = () => {
  const [leftWidth, setLeftWidth] = useState(38.2); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState("default"); // "default" | "chat" | "map"
  const containerRef = useRef(null);

  const setScrollToId = useScrollStore((state) => state.setScrollToId);
  const setParentId = useParentIdStore((state) => state.setParentId);
  const currentParentId = useParentIdStore((state) => state.parentId);
  const { id: flowId } = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { addNodes, addEdges } = useReactFlow();
  const [showSidebar, setShowSidebar] = useState(false);
  const [userFlows, setUserFlows] = useState([]);

  useEffect(() => {
    const fetchUserFlows = async () => {
      try {
        const res = await axios.get("/flow/fetchAllFlows", {
          withCredentials: true,
        });
        setUserFlows(res.data);
      } catch (err) {
        console.error("Error fetching user flows:", err);
      }
    };
    fetchUserFlows();
  }, []);
  const handleDeleteFlow = async (flowId) => {
    try {
      await axios.delete(`/flow/deleteFlow/${flowId}`, {
        withCredentials: true,
      });
      setUserFlows((prev) => prev.filter((flow) => flow._id !== flowId));
    } catch (err) {
      console.error("Error deleting flow:", err);
    }
  };

  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const res = await axios.get(`flow/fetchFlow/${flowId}`, {
          withCredentials: true,
        });

        const { nodes, edges } = res.data;

        if (Array.isArray(nodes)) setNodes(nodes);
        if (Array.isArray(edges)) setEdges(edges);
      } catch (err) {
        console.error("Error fetching flow:", err);
      }
    };

    if (flowId) fetchFlow();
  }, [flowId, setNodes, setEdges]);

  // save flow to backend
  async function saveFlow(flowId, updatedNodes, updatedEdges) {
    try {
      const response = await axios.put(
        `flow/updateFlow/${flowId}`,
        { nodes: updatedNodes, edges: updatedEdges },
        { withCredentials: true }
      );
      console.log("Flow updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating flow:", error);
      throw error;
    }
  }

  // when nodes change
  const handleNodesChange = (changes) => {
    setNodes((currentNodes) => {
      const updatedNodes = applyNodeChanges(changes, currentNodes);
      if (flowId) saveFlow(flowId, updatedNodes, edges);
      return updatedNodes;
    });
  };

  // when edges change
  const handleEdgesChange = (changes) => {
    setEdges((currentEdges) => {
      const updatedEdges = applyEdgeChanges(changes, currentEdges);
      saveFlow(flowId, nodes, updatedEdges);
      return updatedEdges;
    });
  };

  // when user connects two nodes in the canvas
  const handleConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => {
        const newEdge = {
          id: `e${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          animated: true,
          style: { stroke: "#FFFFFF", strokeWidth: 3 },
          markerEnd: { color: "#FFFFFF" },
          type: "smoothstep",
        };
        const updatedEdges = [...currentEdges, newEdge];
        if (flowId) saveFlow(flowId, nodes, updatedEdges);
        return updatedEdges;
      });
    },
    [setEdges, nodes, flowId]
  );

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 100;

  const getLayoutedElements = (nodes, edges, direction = "TB") => {
    dagreGraph.setGraph({ rankdir: direction }); // "TB" = top-to-bottom

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    });
  };

  // add a node (parent is derived from store)
  const handleAddNode = ({ value, answer, tag }) => {
    const newId = uuidv4();

    addNodes([
      {
        id: newId,
        type: "customNode",
        data: { question: value, answer, tag },
        position: { x: 200, y: 300 },
      },
    ]);

    if (currentParentId) {
      setTimeout(() => {
        handleAddEdge({ parentId: currentParentId, childId: newId });
      }, 0);
    }

    // scroll + set parent
    setScrollToId(newId);
    setParentId(newId);
  };

  // add an edge
  const handleAddEdge = ({ parentId, childId }) => {
    setEdges((existingEdges) => {
      const alreadyExists = existingEdges.some(
        (e) => e.source === parentId && e.target === childId
      );
      if (alreadyExists) return existingEdges;

      const newEdge = {
        id: `e${parentId}-${childId}`,
        source: parentId,
        target: childId,
        sourceHandle: "a", // right handle id on source
        targetHandle: "b", // left handle id on target
        animated: true,
        style: { stroke: "#FFFFFF", strokeWidth: 3 },
        markerEnd: { type: "arrowclosed", color: "#FFFFFF" },
        // type: "smoothstep",
      };

      const updated = [...existingEdges, newEdge];
      if (flowId) saveFlow(flowId, nodes, updated);
      return updated;
    });
  };

  // resizing handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 38.2), 61.8);
    setLeftWidth(constrainedWidth);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col h-screen w-screen relative">
      {/* Fixed Hamburger Menu */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
        >
          <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
        </button>
      </div>
      {showSidebar && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Your Chats</h2>
          <ul className="space-y-2">
            {userFlows.map((flow) => {
              const title = flow.nodes?.[0]?.data?.question || "Untitled Chat";
              return (
                <li
                  key={flow._id}
                  className="flex items-center justify-between"
                >
                  <a
                    href={`/flow/${flow._id}`}
                    className="block p-2 rounded hover:bg-gray-100 flex-1"
                  >
                    {title}
                  </a>
                  <button
                    onClick={() => handleDeleteFlow(flow._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Floating Toggle Buttons */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50">
        <button
          onClick={() => setMode("chat")}
          className={`p-2 rounded-full shadow-md ${
            mode === "chat"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          <MessageCircle size={20} />
        </button>
        <button
          onClick={() => setMode("map")}
          className={`p-2 rounded-full shadow-md ${
            mode === "map"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          <Map size={20} />
        </button>
        <button
          onClick={() => setMode("default")}
          className={`p-2 rounded-full shadow-md ${
            mode === "default"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          <Layout size={20} />
        </button>
      </div>

      <div
        className={`flex h-screen w-full overflow-hidden ${
          isDragging ? "select-none" : ""
        }`}
        ref={containerRef}
      >
        {/* Chat Mode → Only Left */}
        {mode === "chat" && (
          <div className="flex flex-col w-full overflow-hidden">
            <LeftComponent handleAddNode={handleAddNode} nodes={nodes} />
          </div>
        )}

        {/* Map Mode → Only Right */}
        {mode === "map" && (
          <div className="flex flex-col w-full overflow-hidden">
            <RightComponent
              nodes={nodes}
              onNodesChange={handleNodesChange}
              nodeTypes={nodeTypes}
              onEdgesChange={handleEdgesChange}
              edges={edges}
              onConnect={handleConnect}
            />
          </div>
        )}

        {/* Default Mode → Both Panels with Resizer */}
        {mode === "default" && (
          <>
            {/* Left Panel */}
            <div
              className="flex flex-col border-r border-gray-300 overflow-hidden"
              style={{ width: `${leftWidth}%` }}
            >
              <LeftComponent handleAddNode={handleAddNode} nodes={nodes} />
            </div>

            {/* Resize Handle */}
            <div
              className={`relative ${
                isDragging ? "w-2" : "w-1"
              } hover:w-2 cursor-col-resize transition-all duration-200 flex-shrink-0 group`}
              onMouseDown={handleMouseDown}
              style={{ zIndex: 10 }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-10 bg-gray-200/80 hover:bg-gray-300/90 rounded-full border border-gray-300/50 flex items-center justify-center transition-all duration-200 group-hover:shadow-sm">
                <div className="w-1 h-8 bg-gray-400/60 rounded group-hover:bg-blue-600"></div>
              </div>
            </div>

            {/* Right Panel */}
            <div
              className="flex flex-col overflow-hidden"
              style={{ width: `${100 - leftWidth}%` }}
            >
              <RightComponent
                nodes={nodes}
                onNodesChange={handleNodesChange}
                nodeTypes={nodeTypes}
                onEdgesChange={handleEdgesChange}
                edges={edges}
                onConnect={handleConnect}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResizableLayout;
