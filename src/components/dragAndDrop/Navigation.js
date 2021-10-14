import React from 'react'
import images from './images'
import { useHistory, useLocation } from 'react-router-dom';


export default function({ title, description, saveFunction, loadDataTest }) {
  const history = useHistory();


  return (
    <>
      <div id="navigation">
        <div id="leftside">
          <div id="details">
            <div id="back" onClick={(e) => {
            history.push(`/`);
          }}>
              <img src={images.arrow} />
            </div>
            <div id="names">
              <p id="title">{title}</p>
              <p id="subtitle">{description}</p>
            </div>
          </div>
        </div>
        {/* <div id="centerswitch">
          <div id="leftswitch">Diagram view</div>
          <div id="rightswitch">Code editor</div>
        </div> */}
        <div id="buttonsright">
          <div id="discard" onClick={(e) => loadDataTest()}>Discard</div>
          <div id="publish" onClick={(e) => saveFunction()}>Publish to site</div>
        </div>
      </div>
    </>
  )
}