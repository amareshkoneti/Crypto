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

  return (
    <div className="card p-3">
      <h4 className="mb-3">Invitation Tree</h4>
      <div style={{ width: "100%", height: "500px" }}>
        {treeData.length > 0 ? (
          <Tree
            data={treeData}
            translate={{ x: 300, y: 50 }}
            orientation="vertical"
            pathFunc="step"
          />
        ) : (
          <p>No users found yet.</p>
        )}
      </div>
    </div>
  );
}
