import React, { useState, useEffect } from "react";
import SidebarTree from "./SidebarItem";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index";
import { useHistory, useLocation } from "react-router-dom";

const flowyData = {
  blockarr: [
    {
      parent: -1,
      childwidth: 1332,
      id: 0,
      x: 666,
      y: 104,
      width: 318,
      height: 120,
    },
    {
      childwidth: 656,
      parent: 0,
      id: 1,
      x: 328,
      y: 303,
      width: 318,
      height: 120,
    },
    {
      childwidth: 318,
      parent: 1,
      id: 2,
      x: 159,
      y: 502,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 1,
      id: 3,
      x: 497,
      y: 502,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 2,
      id: 4,
      x: 159,
      y: 702,
      width: 318,
      height: 120,
    },
    {
      childwidth: 656,
      parent: 0,
      id: 5,
      x: 1004,
      y: 304,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 5,
      id: 6,
      x: 835,
      y: 504,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 5,
      id: 7,
      x: 1173,
      y: 504,
      width: 318,
      height: 120,
    },
  ],
  blocks: [
    {
      id: 0,
      parent: -1,
      depth: 0,
      closed: false,
      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "0",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 527px; top: 44px;",
        },
      ],
    },
    {
      id: 1,
      parent: 0,
      depth: 1,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "1",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 189px; top: 244px;",
        },
      ],
    },
    {
      id: 2,
      parent: 1,
      depth: 2,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "2",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 20px; top: 443px;",
        },
      ],
    },
    {
      id: 3,
      parent: 1,
      depth: 2,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "3",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 358px; top: 443px;",
        },
      ],
    },
    {
      id: 4,
      parent: 2,
      depth: 3,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "4",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 20px; top: 643px;",
        },
      ],
    },
    {
      id: 5,
      parent: 0,
      depth: 1,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "5",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 865px; top: 244px;",
        },
      ],
    },
    {
      id: 6,
      parent: 5,
      depth: 2,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "6",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 696px; top: 444px;",
        },
      ],
    },
    {
      id: 7,
      parent: 5,
      depth: 2,
      closed: false,

      data: [
        {
          name: "blockelemtype",
          value: "1",
        },
        {
          name: "blockid",
          value: "7",
        },
      ],
      attr: [
        {
          class: "blockelem noselect block",
        },
        {
          style: "left: 1034px; top: 444px;",
        },
      ],
    },
  ],
};

export default function Sidebar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();

  const blockDataState = useSelector((state) => state.blockData);
  const dispatch = useDispatch();

  const { loadBlockData, openCloseSidebar } = bindActionCreators(
    actionCreators,
    dispatch
  );

  useEffect(() => {
    console.log(blockDataState);

    if (Object.keys(blockDataState).length !== 0) {
      setIsLoaded(true);
    }
  }, [blockDataState]);

  // useEffect(() => {
  //   //loadBlockData(flowyData);

  //Pull Data from database

  //   console.log(blockDataState);
  //   setIsLoaded(true);
  // }, []);

  const openCloseFolder = (id) => {
    openCloseSidebar(id);
  };

  //blockDataState needs to be reformatted in order to properly render
  if (isLoaded === false) {
    return <div>TEST</div>;
  } else {
    return (
      <div>
        {blockDataState.blocks.map((block) => {
          return (
            <div
              key={block.id}
              style={{ paddingLeft: `${12 * block.depth + 15}px` }}
            >
              <SidebarTree block={block} openCloseFolder={openCloseFolder} />

              <div
                onClick={(e) => {
                  history.push(`/`);
                }}
              >
                Home page
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
