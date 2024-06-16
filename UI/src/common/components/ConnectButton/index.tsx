import React from "react";
import { AppDispatch, useAppSelector } from "../../../state/store";
import { useDispatch } from "react-redux";
import { connectWallet } from "../../../state/services/wallet.service";

export default function ConnectButton() {
	const isConnecting = useAppSelector((s) => s.wallet.isConnecting);
	const isConnected = useAppSelector((s) => s.wallet.isConnected);
	const accountAddress = useAppSelector((s) => s.wallet.accountAddress);
	const dispatch: AppDispatch = useDispatch();
	return (
		<button
			disabled={accountAddress !== undefined || isConnecting}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				dispatch(connectWallet());
			}}
		>
			{accountAddress && <>{accountAddress}</>}
			{!accountAddress && <>Connect Wallet</>}
		</button>
	);
}
