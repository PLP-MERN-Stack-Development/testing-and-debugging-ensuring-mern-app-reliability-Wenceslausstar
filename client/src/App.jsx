import React from "react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Hello from "./components/Hello/Hello";
import Button from "./components/Button/Button";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>MERN App</h1>
          <Hello />
          <Button
            variant="primary"
            onClick={() => console.log("Button clicked!")}
          >
            Test Button
          </Button>
        </header>
      </div>
    </ErrorBoundary>
  );
}

export default App;
