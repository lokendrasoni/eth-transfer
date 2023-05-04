import React from 'react'

export default function Transactions({ receipts }) {
    return (
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
    )
}
