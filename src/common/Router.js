import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from '../components/Home';
import Options from '../components/Options';
import EthTransfer from '../components/EthTransfer';
import Erc20Transfer from '../components/Erc20Transfer';
import GnosisSafe from '../components/GnosisSafe';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/options' element={<Options/>} />
      <Route path='/eth-transfer' element={<EthTransfer/>} />
      <Route path='/erc20-transfer' element={<Erc20Transfer/>} />
      <Route path='/gnosis-safe-transfer' element={<GnosisSafe/>} />
    </Routes>
  )
}
