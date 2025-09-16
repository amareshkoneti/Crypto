import { useEffect, useState } from "react";
import { fetchTree } from "../api";
import Tree from "react-d3-tree";

export default function InvitationTree({ reloadKey }) {
  const [treeData, setTreeData] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [directMembers, setDirectMembers] = useState(0);
  const [indirectMembers, setIndirectMembers] = useState(0);

  // Function to count total nodes in the tree
  const countNodes = (nodes) => {
    let count = 0;
    const traverse = (nodeArray) => {
      nodeArray.forEach(node => {
        count++;
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return count;
  };

  // Function to count direct and indirect members under root node (Pavan)
  const countMembersByType = (nodes) => {
    if (nodes.length === 0) return { direct: 0, indirect: 0, total: 0 };
    
    // Find the root node (assuming first node is Pavan or main root)
    const rootNode = nodes[0];
    let direct = 0;
    let indirect = 0;
    
    // Count direct children (immediate children of root)
    if (rootNode.children && rootNode.children.length > 0) {
      direct = rootNode.children.length;
      
      // Count indirect members (grandchildren and beyond)
      const countIndirect = (children) => {
        let count = 0;
        children.forEach(child => {
          if (child.children && child.children.length > 0) {
            count += child.children.length;
            count += countIndirect(child.children);
          }
        });
        return count;
      };
      
      indirect = countIndirect(rootNode.children);
    }
    
    const total = direct + indirect + 1; // +1 for root node itself
    return { direct, indirect, total };
  };

  useEffect(() => {
    async function load() {
      const data = await fetchTree();
      if (data?.forest) {
        setTreeData(data.forest);
        const counts = countMembersByType(data.forest);
        setTotalMembers(counts.total);
        setDirectMembers(counts.direct);
        setIndirectMembers(counts.indirect);
      }
    }
    load();
  }, [reloadKey]);

  // Professional node spacing
  const nodeSize = { x: 180, y: 120 };
  const separation = { siblings: 1.5, nonSiblings: 1.8 };

  // Clean, professional styling
  const svgStyles = {
    nodes: {
      node: {
        circle: {
          fill: '#ffffff',
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        name: {
          stroke: 'none',
          fill: '#1f2937',
          fontSize: '13px',
          fontWeight: '500',
          textAnchor: 'middle',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }
      },
      leafNode: {
        circle: {
          fill: '#f0f9ff',
          stroke: '#0ea5e9',
          strokeWidth: 2,
        },
        name: {
          stroke: 'none',
          fill: '#1f2937',
          fontSize: '13px',
          fontWeight: '500',
          textAnchor: 'middle',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }
      }
    },
    links: {
      stroke: '#94a3b8',
      strokeWidth: 1.5,
    }
  };

  // Custom render function for clean node display
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    
    return (
      <g>
        {/* Node circle with subtle gradient effect */}
        <circle
          r={hasChildren ? 18 : 15}
          fill={hasChildren ? '#ffffff' : '#f0f9ff'}
          stroke={hasChildren ? '#3b82f6' : '#0ea5e9'}
          strokeWidth="2"
          onClick={toggleNode}
          style={{ 
            cursor: hasChildren ? 'pointer' : 'default',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
        
        {/* Node name with clean typography */}
        <text
          fill="#1f2937"
          fontSize="13px"
          fontWeight="500"
          textAnchor="middle"
          x="0"
          y="-28"
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {nodeDatum.name || 'Unnamed'}
        </text>
        
        {/* Child count indicator for parent nodes */}
        {hasChildren && (
          <text
            fill="#6b7280"
            fontSize="10px"
            textAnchor="middle"
            x="0"
            y="3"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{ pointerEvents: 'none' }}
          >
            {nodeDatum.children.length}
          </text>
        )}
        
        {/* Connection indicator for leaf nodes */}
        {!hasChildren && (
          <circle
            r="3"
            fill="#22c55e"
            cx="0"
            cy="0"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </g>
    );
  };

  return (
    <div className="card p-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Header with team name and member statistics */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-2" style={{ color: '#1f2937', fontWeight: '600' }}>
            TEAM PAVAN
          </h4>
          <div className="d-flex gap-4" style={{ fontSize: '14px' }}>
            <span className="text-muted">
              Direct: <span style={{ fontWeight: '600', color: '#3b82f6' }}>{directMembers}</span>
            </span>
            <span className="text-muted">
              Indirect: <span style={{ fontWeight: '600', color: '#059669' }}>{indirectMembers}</span>
            </span>
            <span className="text-muted">
              Total: <span style={{ fontWeight: '600', color: '#dc2626' }}>{totalMembers}</span>
            </span>
          </div>
        </div>
        <div className="text-end">
          <small className="text-muted">Organization Chart</small>
        </div>
      </div>

      {/* Tree container with professional styling */}
      <div 
        style={{ 
          width: "100%", 
          height: "500px", 
          backgroundColor: '#ffffff',
          border: "1px solid #e5e7eb", 
          borderRadius: "12px",
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
      >
        {treeData.length > 0 ? (
          <Tree
            data={treeData}
            translate={{ x: 300, y: 80 }}
            orientation="vertical"
            pathFunc="step"
            nodeSize={nodeSize}
            separation={separation}
            renderCustomNodeElement={renderCustomNodeElement}
            collapsible={true}
            zoom={0.9}
            styles={svgStyles}
            enableLegacyTransitions={false}
            transitionDuration={300}
            // Additional props for better UX
            scaleExtent={{ min: 0.5, max: 2 }}
            zoomable={true}
            draggable={true}
            initialDepth={2}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '24px', color: '#d1d5db' }}>👥</span>
            </div>
            <p style={{ margin: 0, fontWeight: '500' }}>No team members found</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#d1d5db' }}>
              Start building your team structure
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 d-flex justify-content-center">
        <div className="d-flex gap-4" style={{ fontSize: '12px', color: '#6b7280' }}>
          <div className="d-flex align-items-center gap-1">
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: '#ffffff',
              border: '2px solid #3b82f6'
            }}></div>
            <span>Manager</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: '#f0f9ff',
              border: '2px solid #0ea5e9'
            }}></div>
            <span>Member</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#22c55e'
            }}></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
