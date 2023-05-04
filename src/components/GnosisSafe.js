import React, { useContext, useEffect, useRef } from 'react';
import Store from '../common/Store';
import { useNavigate } from 'react-router-dom';
import { Contract, ethers, AbiCoder } from 'ethers';
import erc20Abi from "../abi/ERC20.json";
import gnosisAbi from "../abi/Gnosis.json";
import { EthersAdapter } from 'contract-proxy-kit';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function GnosisSafe() {
    const address = useRef("");
    const value = useRef(0);
    const token = useRef("");
    const safe = useRef("");
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
            addMessage(`Please provide the token`);
            return;
        }
        if (!safe.current.value) {
            addMessage(`Please provide the safe address`);
            return;
        }

        try {
            const erc20_contract = new Contract(token.current.value, erc20Abi, signer);
            const decimal = await erc20_contract.decimals();
            if (!decimal) {
                addMessage(`No decimal found. The token provided does not seem to be a valid ERC20 token.`);
                return;
            }
            const acc_address = await signer.getAddress();

            const temp_ethers = { ...ethers, utils: { defaultAbiCoder: AbiCoder.defaultAbiCoder() } };

            const ethLibAdapter = new EthersAdapter({
                ethers: temp_ethers,
                signer: signer
            });

            const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
                { type: 'uint256', value: acc_address }, // r
                { type: 'uint256', value: 0 }, // s
                { type: 'uint8', value: 1 } // v
            );

            const val = Number(value.current.value) * Math.pow(10, Number(decimal));
            const data = erc20_contract.interface.encodeFunctionData("transfer", [address.current.value, val]);

            const safe_contract = new Contract(safe.current.value, gnosisAbi, signer);

            const transc = await safe_contract.execTransaction(token.current.value, 0, data, 0, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, autoApprovedSignature);

            if (transc) {
                addMessage(`Transaction Successful. Sent ${value.current.value} to ${address.current.value}`);
            }
            else {
                addMessage(`Transaction Successful. Sent ${value.current.value} to ${address.current.value}`);
            }
        }
        catch (err) {
            addMessage(err.message, 6000);
        }
    }
    return (
        <center>
            <h1>ERC20 Transfer</h1>
            <form onSubmit={transact}>
                <input ref={safe} type='text' placeholder='Safe Address' />
                <input ref={token} type='text' placeholder='Token Address' />
                <input ref={address} type='text' placeholder='Receiver Address' />
                <input ref={value} type='text' placeholder='Amount' />
                <button type='submit'>Send</button>
            </form>
        </center>
    )
}
