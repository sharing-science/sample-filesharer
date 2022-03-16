import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UploadFiles from "./components/upload-files.component";
import LoginPage from "./components/loginPage";

function App() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col"></div>
          <h4 className="mt-4 col">Sample File Sharer </h4>
          <div className="col"></div>
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
