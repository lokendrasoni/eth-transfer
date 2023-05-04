import { Contract } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Store from '../common/Store';
import { useNavigate } from 'react-router-dom';
import abi from "../abi/ERC20.json";
import Transactions from "./Transactions";

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
      return;
    }
    if (!value.current.value) {
      addMessage(`Please provide the value to send`);
      return;
    }
    if (!token.current.value) {
      addMessage(`Please provide the ERC20 token`);
      return;
    }

    try {
      const contract = new Contract(token.current.value, abi, signer);
      const decimal = await contract.decimals();
      if (!decimal) {
        addMessage(`No decimal found. The token provided does not seem to be a valid ERC20 token.`);
        return;
      }
      const val = Number(value.current.value) * Number(decimal);
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
      <Transactions receipts={receipts}/>
    </center>
  )
}
