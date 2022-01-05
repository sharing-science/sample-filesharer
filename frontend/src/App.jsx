import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UploadFiles from "./components/upload-files.component";
import LoginPage from "./components/loginPage";

function App() {
  return (
    <>
      <div className="container" style={{ width: "600px" }}>
        <div style={{ margin: "20px" }}>
          <h4>React upload Files</h4>
        </div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<UploadFiles />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
