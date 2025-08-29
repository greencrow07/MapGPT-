import React, { useEffect, useRef } from "react";
import "./Lattice.css";

const RandomLattice = () => {
  const latticeRef = useRef(null);
  const renderCount = useRef(0);

  const nodeCount = 100;
  const connectionDistance = 150;
  const depthRange = 1200;
  const width = window.innerWidth;
  const height = window.innerHeight;
  useEffect(()=>{
    renderCount.current += 1 ; 
    console.log("lattice background reloaded :", renderCount.current, "at", new Date().toLocaleTimeString())
  },[])

  useEffect(() => {
    const lattice = latticeRef.current;
    lattice.innerHTML = "";

    const positions = [];

    for (let i = 0; i < nodeCount; i++) {
     const x = Math.random() * width * 2 - width; // double spread
const y = Math.random() * height * 2 - height;

      const z = (Math.random() - 0.5) * depthRange;

      const node = document.createElement("div");
      node.className = "node";
      node.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      lattice.appendChild(node);
      positions.push({ x, y, z });
    }

    positions.forEach(pos1 => {
      positions.forEach(pos2 => {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist > 0 && dist < connectionDistance) {
          const edge = document.createElement("div");
          edge.className = "edge";

          const midX = (pos1.x + pos2.x) / 2;
          const midY = (pos1.y + pos2.y) / 2;
          const midZ = (pos1.z + pos2.z) / 2;

          const length = dist + Math.random() * 20 - 10; // Slight organic variation
          const thickness = 1;

          edge.style.width = `${length}px`;
          edge.style.height = `${thickness}px`;

          edge.style.transform = `translate3d(${midX}px, ${midY}px, ${midZ}px)`;

          const angleY = Math.atan2(dz, dx) * (180 / Math.PI);
          const angleZ = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);

          // Slight random tilt for organic, imperfect look
          const randomTilt = (Math.random() - 0.5) * 15;

          edge.style.transform += ` rotateY(${angleY + randomTilt}deg) rotateZ(${angleZ + randomTilt}deg)`;

          lattice.appendChild(edge);
        }
      });
    });
  }, []);

  return (
    <div className="lattice-container">
      <div className="lattice" ref={latticeRef}></div>
    </div>
  );
};

export default RandomLattice;
