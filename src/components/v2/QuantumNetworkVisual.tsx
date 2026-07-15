import { useState, type PointerEvent } from "react";

const nodes = [
  { x: 72, y: 126 },
  { x: 162, y: 62 },
  { x: 202, y: 164 },
  { x: 302, y: 98 },
  { x: 388, y: 48 },
  { x: 424, y: 158 },
  { x: 536, y: 94 },
  { x: 576, y: 178 },
  { x: 324, y: 212 },
  { x: 142, y: 226 },
];

const edges = [
  [0, 1], [0, 2], [0, 9], [1, 2], [1, 3], [1, 4], [2, 3], [2, 8], [2, 9],
  [3, 4], [3, 5], [3, 8], [4, 5], [4, 6], [5, 6], [5, 7], [5, 8], [6, 7], [7, 8], [8, 9],
];

function QuantumNetworkVisual() {
  const [observedNode, setObservedNode] = useState<number | null>(null);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) {
      return;
    }

    const pointer = event.currentTarget.createSVGPoint();
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const localPointer = pointer.matrixTransform(matrix.inverse());

    let nearestNode: number | null = null;
    let nearestDistance = 112;

    nodes.forEach((node, index) => {
      const distance = Math.hypot(node.x - localPointer.x, node.y - localPointer.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestNode = index;
      }
    });

    setObservedNode(nearestNode);
  };

  return (
    <div className={`v2-quantum-network ${observedNode !== null ? "is-observed" : ""}`} aria-hidden="true">
      <svg
        viewBox="0 0 640 280"
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setObservedNode(null)}
      >
        <g className="v2-quantum-network__noise">
          <path d="M21 181C95 34 180 245 262 91S441 254 619 38" />
          <path d="M12 84C106 236 183 17 292 184S486 20 631 196" />
          <path d="M94 9C39 164 234 113 284 258S477 116 605 246" />
        </g>

        <g className="v2-quantum-network__edges">
          {edges.map(([start, end], index) => {
            const isDefined = observedNode === start || observedNode === end;
            return (
              <line
                className={isDefined ? "is-defined" : ""}
                key={`${start}-${end}`}
                x1={nodes[start].x}
                y1={nodes[start].y}
                x2={nodes[end].x}
                y2={nodes[end].y}
                style={{ animationDelay: `${index * -0.17}s` }}
              />
            );
          })}
        </g>

        <g className="v2-quantum-network__nodes">
          {nodes.map((node, index) => {
            const isDefined = observedNode === index;
            const isLinked = edges.some(
              ([start, end]) =>
                (start === observedNode && end === index) ||
                (end === observedNode && start === index),
            );

            return (
              <g
                className={`${isDefined ? "is-defined" : ""} ${isLinked ? "is-linked" : ""}`}
                key={`${node.x}-${node.y}`}
                transform={`translate(${node.x} ${node.y})`}
                style={{ animationDelay: `${index * -0.31}s` }}
              >
                <circle className="v2-quantum-network__orbit" r="18" />
                <circle className="v2-quantum-network__halo" r="10" />
                <circle className="v2-quantum-network__dot" r="3.5" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default QuantumNetworkVisual;
