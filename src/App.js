import React, { useState } from 'react';
import './App.css';
import Store from './common/Store';
import { BrowserRouter } from 'react-router-dom';
import Router from './common/Router';

function App() {
  const [message, setMessage] = useState("");
  const [signer, setSigner] = useState("");
  const [provider, setProvider] = useState("");

  const addMessage = (m, time = 1500) => {
    setMessage(m);
    setTimeout(() => {
      setMessage("");
    }, time);
  }

  return (
    <Store.Provider value={{ addMessage, signer, setSigner, provider, setProvider }}>
      <div style={{ marginBottom: "2rem" }}>{message}</div>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </Store.Provider>
  );
}

export default App;
