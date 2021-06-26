import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

const App = () => {
  const [version, setVersion] = useState("Loading version...");

  useEffect(() => {
    const getAppVersion = () => {
      ipcRenderer.send("get-version");
      ipcRenderer.once("get-version-reply", (event, arg) => {
        setVersion(arg);
      });
    };
    getAppVersion();
  }, []);
  return (
    <>
      <h1>Hello World!</h1>
      <p>Current version: {version}</p>
    </>
  );
};

export default App;
