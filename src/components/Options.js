import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Store from '../common/Store';

export default function Options() {
  const navigate = useNavigate();
  const { signer } = useContext(Store);

  useEffect(() => {
    if (!signer) {
      navigate("/");
    }
  }, [navigate, signer]);

  return (
    <center>
      <button onClick={() => navigate("/eth-transfer")} style={{ marginBottom: "2rem" }}>ETH Transfer</button>
      <button onClick={() => navigate("/erc20-transfer")}>ERC20 Transfer</button>
    </center>
  )
}
