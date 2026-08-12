import { useEffect, useState, type CSSProperties } from "react";
import useMediaQuery from "./useMediaQuery";

const desktopNodes = [
  { x: 18, y: 18 },
  { x: 46, y: 36 },
  { x: 81, y: 25 },
  { x: 52, y: 81 },
];

const mobileNodes = [
  { x: 22, y: 12 },
  { x: 72, y: 28 },
  { x: 30, y: 56 },
  { x: 65, y: 86 },
];

const edges = [[0, 1], [1, 2], [1, 3]] as const;

function QuantumNetworkVisual() {
  const compact = useMediaQuery("(max-width: 900px)");
  const [observedNode, setObservedNode] = useState<number | null>(null);
  const nodes = compact ? mobileNodes : desktopNodes;

  useEffect(() => {
    if (compact) {
      setObservedNode(null);
    }
  }, [compact]);

  return (
    <div className={`v2-quantum-network${observedNode !== null ? " is-observed" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <g className="v2-quantum-network__edges">
          {edges.map(([start, end]) => (
            <line
              className={observedNode === start || observedNode === end ? "is-defined" : ""}
              key={`${start}-${end}`}
              x1={nodes[start].x}
              y1={nodes[start].y}
              x2={nodes[end].x}
              y2={nodes[end].y}
            />
          ))}
        </g>
      </svg>
      <div className="v2-quantum-network__nodes">
        {nodes.map((node, index) => {
          const isDefined = observedNode === index;
          const isLinked = observedNode !== null && edges.some(
            ([start, end]) => (
              (start === index && end === observedNode)
              || (end === index && start === observedNode)
            ),
          );
          const nodeStyle = {
            "--network-x": `${node.x}%`,
            "--network-y": `${node.y}%`,
            "--network-delay": `${(index * 0.18).toFixed(2)}s`,
          } as CSSProperties;

          return (
            <span
              className={`v2-quantum-network__node${isDefined ? " is-defined" : ""}${isLinked ? " is-linked" : ""}`}
              key={`${node.x}-${node.y}`}
              style={nodeStyle}
              onPointerEnter={compact ? undefined : () => setObservedNode(index)}
              onPointerLeave={compact ? undefined : () => setObservedNode(null)}
            >
              <span className="v2-quantum-network__halo" />
              <span className="v2-quantum-network__dot" />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default QuantumNetworkVisual;
