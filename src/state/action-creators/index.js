
//This needs to be a get request from the datbase
export const loadBlockData = (blockData) => {
  return (dispatch) => {
    dispatch({
      type: 'loadBlockData',
      payload: blockData
    })
  }
}

//this will save the data to the database
export const saveBlockData = (blockData) => {
  
  return (dispatch) => {
    dispatch({
      type: 'SAVE',
      payload: blockData
    })
  }
}


//function to update the openclose state of an id
export const openCloseSidebar = (blockId) => {  
  return (dispatch) => {
    dispatch({
      type: 'openCloseSidebar',
      payload: blockId
    })
  }
}




// export const openCloseSidebar = (user_id) => 
//     async (dispatch) => {
//         const response = await axios.get("/api_pages/")

//         const pages = []

//         // Only get the pages for the current user
//         response.data.forEach(page => {
//             if (page.creator === user_id) {
//                 pages.push(page)
//             }
//         });

//         dispatch({ type: 'FETCH_PAGES', payload: pages });
//     };