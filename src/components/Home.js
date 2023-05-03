import React, { useContext, useEffect } from 'react';
import Store from '../common/Store';
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { addMessage, setSigner, signer, setProvider } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    if (signer) {
      navigate("/options");
    }
  }, [navigate, signer]);

  const connect = async () => {
    let _provider;
    if (window.ethereum == null) {
      addMessage("MetaMask not installed; using read-only defaults");
      _provider = ethers.getDefaultProvider();
    } else {
      addMessage("", 100);
      _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      setSigner(_signer);

      navigate("/options", {  })
    }
    setProvider(_provider);
  };

  return (
    <center>
      <h2>Welcome! Please connect your wallet</h2>
      <button onClick={connect}>Connect to your wallet</button>
    </center>
  )
}
