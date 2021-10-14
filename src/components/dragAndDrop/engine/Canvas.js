import BlockElement from "./BlockElement";
import Block from "./Block";

class Canvas {
  constructor({ window, document, node, spacingX = 20, spacingY = 80 }) {
    this.window = window;
    this.document = document;
    this.node = node;
    this.spacingX = spacingX;
    this.spacingY = spacingY;

    this.state = {};
    this.blocks = [];
    this.isInitialized = false;
    this.isDragging = false;
    this.isDraggingBlock = false;
    this.isRearranging = false;
    this.isLastEvent = false;
    this.grabbedNode = null;
    this.draggedElement = null;
    this.draggedTree = [];
  }

  initialize = () => {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    this.reset();
  };

  //no issue here
  position = () => {
    // console.log(this.node.getBoundingClientRect());
    const { top, left } = this.node.getBoundingClientRect();

    return {
      top: top + this.window.scrollY,
      left: left + this.window.scrollX,
      scrollTop: this.node.scrollTop,
      scrollLeft: this.node.scrollLeft,
    };
  };

  html = (html) => {
    if (html !== undefined) {
      return (this.node.innerHTML = html);

      //insertAdjacentHTML('beforeEnd', html);
    }
    return this.node.innerHTML;
  };

  appendHtmlToCanvas = (html) => {
    let canvas = this.document.getElementById("canvas");

    return canvas.insertAdjacentHTML("beforeEnd", html);
    // return canvas.innerHTML = html
  };

  appendHtml = (html) => {
    return this.node.insertAdjacentHTML("beforeEnd", html);

    //return this.node.innerHTML;
  };

  appendChild = (...children) => {
    children.forEach((child) => this.node.appendChild(child));
  };

  findBlockElement = (id) => BlockElement.find(id, { window: this.window });

  //issue with importing 1 block?
  //https://github.com/alyssaxuu/flowy/commit/edb1f1f49b92995d75c63496b71e5f520d677327
  //issue with x and y placement

  //how to recreate: save blocks, then move, then reimport.
  //Blue dot will think old location is where it is, hover will be off

  loadData = (html, blockarr, blockDataState) => {
    //console.log(this.blocks);
    //console.log(html);
    this.appendHtmlToCanvas(html);
    this.replaceBlocks(blockarr);

    this.state = blockDataState.state;
    this.isInitialized = blockDataState.isInitialized;
    this.isLastEvent = blockDataState.isLastEvent;
    this.grabbedNode = blockDataState.grabbedNode;
    this.draggedElement = blockDataState.draggedElement;
    this.node = blockDataState.nodeTest;

    //console.log(this.blocks);
  };

  //need to add depth
  output = () => {
    const { blocks } = this;

    if (blocks === undefined || blocks.length < 0) {
      return null;
    }
    return {
      html: this.html(),
      blockarr: blocks.slice(),

      state: this.state,
      isInitialized: this.isInitialized,
      isLastEvent: this.isLastEvent,
      grabbedNode: this.grabbedNode,
      draggedElement: this.draggedElement,
      nodeTest: this.node,

      blocks: blocks.map(({ id, parent, depth }) => {
        const { node } = this.findBlockElement(id);

        return {
          id,
          parent,
          depth,
          data: [...node.querySelectorAll("input")].map(({ name, value }) => ({
            name,
            value,
          })),
          attr: [...node.attributes].map(({ name, value }) => ({
            name,
            value,
          })),
        };
      }),
    };
  };

  grab = (grabbedNode) => {
    const { mouseX, mouseY } = this.state;
    const draggedElement = grabbedNode.cloneNode(true);
    const id = this.nextBlockID();

    draggedElement.classList.remove("create-flowy");
    draggedElement.innerHTML += `<input type='hidden' name='blockid' class='blockid' value='${id}'>`;

    this.document.body.appendChild(draggedElement);

    this.grabbedNode = grabbedNode;

    this.registerDragger(draggedElement);

    const { dragX, dragY } = this.setState({
      dragX: mouseX - grabbedNode.offsetLeft,
      dragY: mouseY - grabbedNode.offsetTop,
    });

    //I think this is the issue - style field not being added to draggedElement

    this.draggedElement.styles({
      left: mouseX - dragX + "px",
      top: mouseY - dragY + "px",
    });

    //Is this a valid replacement for the above code?
    // draggedElement.style.left =  mouseX - dragX + "px";
    // draggedElement.style.top =  mouseY - dragY + "px";

    this.toggleDragger(true);

    return draggedElement;
  };

  registerDragger = (draggedElement) => {
    this.draggedElement = BlockElement.fromElement(draggedElement, {
      window: this.window,
    });
  };

  toggleDragger = (start, { remove = false } = {}) => {
    const draggedElement = this.draggedElement.node;

    if (start) {
      this.grabbedNode.classList.add("dragnow");
      draggedElement.classList.add("dragging");
      draggedElement.classList.add("block");
    } else {
      this.grabbedNode.classList.remove("dragnow");
      draggedElement.classList.remove("dragging");

      if (remove) {
        draggedElement.remove();
      }
    }
  };

  nextBlockID = () =>
    this.blocks.length === 0
      ? 0
      : Math.max(...this.blocks.map(({ id }) => id)) + 1;

  addBlockForElement = (
    blockElement,
    { parent = -1, childWidth = 0, depth = 0 } = {}
  ) => {
    const { scrollLeft, scrollTop } = this.position();

    this.blocks.push(
      new Block({
        parent,
        depth,
        childWidth,
        id: blockElement.id,
        x:
          blockElement.position().left +
          blockElement.position().width / 2 +
          scrollLeft,
        y:
          blockElement.position().top +
          blockElement.position().height / 2 +
          scrollTop,
        width: blockElement.position().width,
        height: blockElement.position().height,
      })
    );
  };

  findBlock = (id, { tree = false } = {}) =>
    (tree ? this.draggedTree : this.blocks).find((block) => block.id === id);

  replaceBlocks = (blocks) => {
    this.blocks.splice(0, this.blocks.length, ...blocks);
  };

  appendBlocks = (blocks) => {
    this.blocks.push(...blocks);
    console.log(this.blocks);
  };

  removeBlock = (block, { removeArrow = false } = {}) => {
    this.replaceBlocks(this.blocks.filter(({ id }) => id !== block.id));

    // remove arrow for child blocks
    if (removeArrow) {
      const arrowElement = this.findBlockElement(block.id).arrow();

      if (arrowElement) {
        arrowElement.remove();
      }
    }
  };

  findChildBlocks = (id) => {
    return this.blocks.filter(({ parent }) => parent === id);
  };

  reset = () => {
    this.html("<div class='indicator invisible'></div>");
    this.blocks.splice(0);
  };

  deleteBlock = function (id, rearrangeMe) {
    let newParentId;

    if (!Number.isInteger(id)) {
      id = parseInt(id);
    }

    //This finds the the clicked on block
    for (var i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].id === id) {
        //get the parent of the deleted block
        newParentId = this.blocks[i].parent;
        this.node.appendChild(document.querySelector(".indicator"));

        //pass id of clicked on block to be deleted
        removeBlockEls(this.blocks[i].id);
        this.blocks.splice(i, 1);

        modifyChildBlocks(id, this.blocks);
        break;
      }
    }

    if (this.blocks.length > 1) {
      rearrangeMe();
    }

    return Math.max.apply(
      Math,
      this.blocks.map((a) => a.id)
    );

    function modifyChildBlocks(parentId, modifiedBlock) {
      let children = [];
      let blocko = modifiedBlock.map((a) => a.id);
      for (var i = blocko.length - 1; i >= 0; i--) {
        let currentBlock = modifiedBlock.filter((a) => a.id == blocko[i])[0];
        if (currentBlock.parent === parentId) {
          children.push(currentBlock.id);
          removeBlockEls(currentBlock.id);
          modifiedBlock.splice(i, 1);
        }
      }

      // for (var i = 0; i < children.length; i++) {
      //   modifyChildBlocks(children[i]);
      // }
    }
    function removeBlockEls(id) {
      //remove element
      document
        .querySelector(".blockid[value='" + id + "']")
        .parentNode.remove();

      //remove arrow
      if (document.querySelector(".arrowid[value='" + id + "']")) {
        document
          .querySelector(".arrowid[value='" + id + "']")
          .parentNode.remove();
      }
    }
  };

  groupDraggedTree = () => {
    const { top, left } = this.draggedElement.position();
    const draggedBlock = this.findBlock(this.draggedElement.id);

    this.draggedTree.push(draggedBlock);
    // remove dragged block from canvas
    this.removeBlock(draggedBlock, { removeArrow: true });

    const childBlocks = this.findChildBlocks(draggedBlock.id);
    let layer = childBlocks;
    const allBlocks = [];

    // Move child block DOM nodes into dragged block node for easier dragging
    do {
      const foundids = layer.map(({ id }) => id);

      layer.forEach((block) => {
        this.draggedTree.push(block);

        const blockElement = this.findBlockElement(block.id);
        const arrowElement = blockElement.arrow();

        blockElement.styles({
          left: blockElement.position().left - left + "px",
          top: blockElement.position().top - top + "px",
        });
        arrowElement.styles({
          left: arrowElement.position().left - left + "px",
          top: arrowElement.position().top - top + "px",
        });

        this.draggedElement.node.appendChild(blockElement.node);
        this.draggedElement.node.appendChild(arrowElement.node);
      });

      allBlocks.push(...layer);

      // finds next children
      layer = this.blocks.filter(({ parent }) => foundids.includes(parent));
    } while (layer.length);

    childBlocks.forEach(this.removeBlock);
    allBlocks.forEach(this.removeBlock);
  };

  ungroupDraggedTree = () => {
    this.draggedTree.forEach((block) => {
      if (block.id === this.draggedElement.id) {
        return;
      }

      const blockElement = this.findBlockElement(block.id);
      const arrowElement = blockElement.arrow();
      const { left, top, scrollLeft, scrollTop } = this.position();

      console.log(this.position());

      blockElement.styles({
        left: blockElement.position().left - left + scrollLeft + "px",
        top: blockElement.position().top - top + scrollTop + "px",
      });

      arrowElement.styles({
        left: arrowElement.position().left - left + scrollLeft + "px",
        top: arrowElement.position().top - (top + scrollTop) + "px",
      });

      this.appendChild(blockElement.node, arrowElement.node);

      console.log("BLOCK", blockElement.position().left);

      //this is potentially where the issue is
      block.x =
        blockElement.position().left +
        blockElement.node.offsetWidth / 2 +
        scrollLeft;
      block.y =
        blockElement.position().top +
        blockElement.node.offsetHeight / 2 +
        scrollTop;
    });

    const rootBlock = this.draggedTree.find(({ id }) => id === 0);

    rootBlock.x =
      this.draggedElement.position().left +
      this.draggedElement.position().width / 2;
    rootBlock.y =
      this.draggedElement.position().top +
      this.draggedElement.position().height / 2;

    this.appendBlocks(this.draggedTree);
    this.draggedTree.splice(0);
  };

  inSnapZoneFor = (block) => {
    const { x, y, width, height } = block;
    const { left, top, width: draggedWidth } = this.draggedElement.position();

    const { scrollLeft, scrollTop } = this.position();

    const zoneX = left + draggedWidth / 2 + scrollLeft;
    const zoneY = top + scrollTop;

    return (
      zoneX >= x - width / 2 - this.spacingX &&
      zoneX <= x + width / 2 + this.spacingX &&
      zoneY >= y - height / 2 &&
      zoneY <= y + height
    );
  };

  //or issue here?
  inDropZone = () => {
    const { top, left } = this.draggedElement.position();

    return top > this.position().top && left > this.position().left;
  };

  //dropping first block onto the canvas
  drop = () => {
    const { top, left, scrollTop, scrollLeft } = this.position();

    this.draggedElement.styles({
      top: this.draggedElement.position().top - top + scrollTop + "px",
      left: this.draggedElement.position().left - left + scrollLeft + "px",
    });

    this.appendChild(this.draggedElement.node);
    this.addBlockForElement(this.draggedElement);
  };

  cancelDrop = () => {
    this.appendChild(this.indicator());
    this.toggleDragger(false, { remove: true });
  };

  indicator = () => this.document.querySelector(".indicator");

  showIndicator = (show, block) => {
    // if (this.indicator() === null) {
    //   console.log(this.document);

    // }

    const indicator = this.indicator();
    //console.log(indicator);

    if (show) {
      if (block) {
        const blockElement = this.findBlockElement(block.id);
        blockElement.node.appendChild(indicator);

        indicator.style.left =
          this.draggedElement.position().width / 2 - 5 + "px";
        indicator.style.top = blockElement.position().height + "px";
      }

      indicator.classList.remove("invisible");
    } else if (!indicator.classList.contains("invisible")) {
      indicator.classList.add("invisible");
    }
  };

  //Check these positioning thigns
  //position when dragging the elemnt before dropping on canvas
  updateDragPosition = () => {
    const { mouseX, mouseY, dragX, dragY } = this.state;

    this.draggedElement.styles({
      left: mouseX - dragX + "px",
      top: mouseY - dragY + "px",
    });
  };

  //dragging elements on the canvas
  updateRearrangePosition = () => {
    const { mouseX, mouseY, dragX, dragY } = this.state;
    const { left, top, scrollLeft, scrollTop } = this.position();

    this.draggedElement.styles({
      left: mouseX - dragX - left + scrollLeft + "px",
      top: mouseY - dragY - top + scrollTop + "px",
    });
  };

  setState = (state) => {
    return Object.assign(this.state, state);
  };

  getState = (key) => this.state[key];

  toggleDragging = (dragging) => {
    this.isDragging = dragging;
  };

  toggleDraggingBlock = (dragging) => {
    this.isDraggingBlock = dragging;
  };

  toggleRearranging = (rearranging) => {
    this.isRearranging = rearranging;
  };

  toggleLastEvent = (last) => {
    this.isLastEvent = last;
  };
}

export default Canvas;
