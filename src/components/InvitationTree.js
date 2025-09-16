import { useEffect, useState } from "react";
import { fetchTree } from "../api";
import Tree from "react-d3-tree";

export default function InvitationTree({ reloadKey }) {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchTree();
      if (data?.forest) {
        setTreeData(data.forest);
      }
    }
    load();
  }, [reloadKey]);

  // Custom node styling to prevent text overlap
  const nodeSize = { x: 200, y: 100 }; // Increased spacing between nodes
  
  const separation = { siblings: 2, nonSiblings: 2 }; // More separation between nodes

  // Custom styles for better text visibility
  const svgStyles = {
    nodes: {
      node: {
        circle: {
          fill: '#4299e1',
          stroke: '#2b6cb0',
          strokeWidth: 2,
        },
        name: {
          stroke: 'none',
          fill: '#1a202c',
          fontSize: '14px',
          fontWeight: 'bold',
          textAnchor: 'middle',
          dominantBaseline: 'middle',
        },
        attributes: {
          stroke: 'none',
          fill: '#4a5568',
          fontSize: '12px',
          textAnchor: 'middle',
        }
      },
      leafNode: {
        circle: {
          fill: '#48bb78',
          stroke: '#38a169',
          strokeWidth: 2,
        },
        name: {
          stroke: 'none',
          fill: '#1a202c',
          fontSize: '14px',
          fontWeight: 'bold',
          textAnchor: 'middle',
          dominantBaseline: 'middle',
        },
        attributes: {
          stroke: 'none',
          fill: '#4a5568',
          fontSize: '12px',
          textAnchor: 'middle',
        }
      }
    },
    links: {
      stroke: '#a0aec0',
      strokeWidth: 2,
    }
  };

  // Custom render function for node labels
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => (
    <g>
      {/* Node circle */}
      <circle
        r={20}
        fill={nodeDatum.children ? '#4299e1' : '#48bb78'}
        stroke={nodeDatum.children ? '#2b6cb0' : '#38a169'}
        strokeWidth="2"
        onClick={toggleNode}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Node name - positioned above the circle */}
      <text
        fill="#1a202c"
        fontSize="14px"
        fontWeight="bold"
        textAnchor="middle"
        x="0"
        y="-30"
        style={{ pointerEvents: 'none' }}
      >
        {nodeDatum.name}
      </text>
      
      {/* Additional attributes - positioned below the circle */}
      {nodeDatum.attributes && Object.keys(nodeDatum.attributes).length > 0 && (
        <g>
          {Object.entries(nodeDatum.attributes).map(([key, value], index) => (
            <text
              key={key}
              fill="#4a5568"
              fontSize="12px"
              textAnchor="middle"
              x="0"
              y={35 + (index * 15)}
              style={{ pointerEvents: 'none' }}
            >
              {`${key}: ${value}`}
            </text>
          ))}
        </g>
      )}
    </g>
  );

  return (
    <div className="card p-3">
      <h4 className="mb-3">TEAM PAVAN</h4>
      <div style={{ width: "100%", height: "500px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
        {treeData.length > 0 ? (
          <Tree
            data={treeData}
            translate={{ x: 300, y: 80 }} // Adjusted starting position
            orientation="vertical"
            pathFunc="step"
            nodeSize={nodeSize}
            separation={separation}
            renderCustomNodeElement={renderCustomNodeElement}
            collapsible={true}
            zoom={0.8} // Slightly zoomed out to show more content
            styles={svgStyles}
            // Enable pan and zoom
            enableLegacyTransitions={false}
            transitionDuration={500}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#718096',
            fontSize: '16px'
          }}>
            No users found yet.
          </div>
        )}
      </div>
    </div>
  );
}
