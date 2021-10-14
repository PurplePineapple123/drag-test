import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import DragAndDropView from "./components/dragAndDrop/DragAndDropView";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/builder">
          <DragAndDropView />
        </Route>

        <Route exact path="/sidebar">
          <Sidebar />
        </Route>

        <Route exact path="/">
          <Link to="/builder">Builder</Link>
          <Link to="/sidebar">sidebar</Link>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
