import { parseEther } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Store from '../common/Store';
import { useNavigate } from 'react-router-dom';

export default function EthTransfer() {
  const [receipts, setReceipts] = useState([]);
  const address = useRef("");
  const value = useRef(0);
  const { addMessage, signer } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    if (!signer) {
      navigate("/");
    }
  }, [navigate, signer]);
  
  const transact = async (e) => {
    e.preventDefault();
    if (!address.current.value) {
      addMessage(`Please provide an address`);
    }
    if (!value.current.value) {
      addMessage(`Please provide the ETH to send`);
    }

    const wei = parseEther(value.current.value.toString());

    try {
      const tx = await signer.sendTransaction({ to: address.current.value, value: wei });

      const receipt = await tx.wait();

      setReceipts(v => {
        return [receipt, ...v];
      });
      addMessage(`Transaction Successful. Sent ${value.current.value} to ${address.current.value}`);
    }
    catch (err) {
      addMessage(err.message, 6000);
    }
  }

  return (
    <center>
      <h1>ETH Transfer</h1>
      <form onSubmit={transact}>
        <input ref={address} type='text' placeholder='Address' />
        <input ref={value} type='text' placeholder='ETH' />
        <button type='submit'>Send</button>
      </form>

      {
        receipts.length ?
          <>
            <h2>Receipts (Will be cleared on reload)</h2>
            <table border={"black"}>
              <thead>
                <tr>
                  <th>Transaction Hash</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Gas used</th>
                </tr>
              </thead>
              <tbody>
                {
                  receipts.map((receipt, i) => {
                    return (
                      <tr key={i}>
                        <th>{receipt.hash}</th>
                        <td>{receipt.from}</td>
                        <td>{receipt.to}</td>
                        <td>{parseInt(receipt.gasUsed)}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </>
          : ""
      }
    </center>
  )
}
