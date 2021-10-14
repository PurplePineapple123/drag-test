const blockDatareducer = (blockData = {}, action) => {
  switch (action.type) {
    case "loadBlockData":
      return action.payload;
    case "SAVE":
      return action.payload
    case "openCloseSidebar":
      //if blockData isn't empty
      //find document in blockdata with action.paylod id
      //then update it to the opposite of it's current state (open/closed)
      //save the updated state

      //let tempBlockData = [...blockData.blocks]

      let tempBlockData = JSON.parse(JSON.stringify(blockData));

      let foundBlockIndex = tempBlockData.blocks.findIndex(
        (x) => x.id === action.payload
      );

      if (tempBlockData.blocks[foundBlockIndex].closed === false) {
        tempBlockData.blocks[foundBlockIndex].closed = true;
      } else {
        tempBlockData.blocks[foundBlockIndex].closed = false;
      }

      let clickedBlock = tempBlockData.blocks[foundBlockIndex];
      console.log(clickedBlock)

      //find the parent (element that was clicked on)
      //find all the elements whos parent is the element that was clicked on
      //if the parent is closed, all the children elements needs to be closed as well

      let indexes = [];

      function getAllIndexes(arr, val) {
        for (let i = 0; i < arr.length; i++)
          if (arr[i].parent === val) {
            indexes.push(i);
            getAllIndexes(tempBlockData.blocks, arr[i]);
          }
        return indexes;
      }

      getAllIndexes(tempBlockData.blocks, clickedBlock.id)

      console.log(indexes);


      const recursionClose = (clickedBlock) => {
        //check to see if clicked block has any children (x.parent === clickedblock.id)
        //for each child, find index of that child and then find that children
        //repeat until no children exist
      };

      //this needs to recursively traverse down the tree until no more children

      //this only grabs 1 block id
      // let childrenBlockIndex = tempBlockData.blocks.findIndex(
      //   (x) => x.parent === action.payload
      // );
      // console.log(childrenBlockIndex);

      // function getAllIndexes(arr, val) {
      //   var indexes = [],
      //     i;
      //   for (i = 0; i < arr.length; i++)
      //     if (arr[i].parent === val) indexes.push(i);
      //   return indexes;
      // }

      // //this gets all the direct children, but not their children
      // console.log(getAllIndexes(tempBlockData.blocks, action.payload));

      return tempBlockData;

    default:
      return blockData;
  }
};

export default blockDatareducer;

//pull data from DB
//Save data to DB
//Delete blocks
//Add blocks
//Update blocks
