import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SDKProvider } from '@telegram-apps/sdk-react';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
  <SDKProvider>
    <App />
  </SDKProvider>
  // </StrictMode>
);
