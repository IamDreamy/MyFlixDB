import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

// Main component (will eventually use all the others)
class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();
    // Initialize the state to an empty object so we can destructure it later
    this.state = {};
  }
  // This overrides the render() method of the superclass
  // No need to call super() though, as it does nothing by default
  render() {
    return <div className="main-view"></div>;
  }
}
// Finds the root of your app
const container = this.state;

// Tells React to render your app in the root DOM element
// ReactDOM.render(React.createElement(MainView), container);
