import React from "react";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";

export default function SidebarTree({ block, openCloseFolder }) {
  return (
    <div>
      <div
        onClick={() => {
          openCloseFolder(block.id)
        }}
      >
        {block.closed === true ? (
          <FaAngleRight className="text-gray-400" />
        ) : (
          <FaAngleDown className="text-gray-400" />
        )}
      </div>

      {block.id}
    </div>
  );
}
