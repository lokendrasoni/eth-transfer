import { Contract } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Store from '../common/Store';
import { useNavigate } from 'react-router-dom';
import abi from "../abi.json";

export default function Erc20Transfer() {
  const [receipts, setReceipts] = useState([]);
  const address = useRef("");
  const value = useRef(0);
  const token = useRef("");
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
      addMessage(`Please provide the value to send`);
    }
    if (!token.current.value) {
      addMessage(`Please provide the ERC20 token`);
    }

    const val = Number(value.current.value);

    try {
      const contract = new Contract(token.current.value, abi, signer)
      const tx = await contract.transfer(address.current.value, val);

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
      <h1>ERC20 Transfer</h1>
      <form onSubmit={transact}>
        <input ref={token} type='text' placeholder='ERC20 Token' />
        <input ref={address} type='text' placeholder='Receiver Address' />
        <input ref={value} type='text' placeholder='Amount' />
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
