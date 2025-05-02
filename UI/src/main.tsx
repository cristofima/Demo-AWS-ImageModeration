import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";
import { BrowserRouter } from "react-router-dom";

Amplify.configure(awsExports);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
