class Block {
  constructor({ parent, childWidth, id, x, y, width, height, depth }) {
    Object.assign(this, {
      parent,
      childWidth,
      id,
      x,
      y,
      width,
      height, 
      depth
    })
  }

  maxWidth = () => Math.max(this.childWidth, this.width)
}

export default Block
