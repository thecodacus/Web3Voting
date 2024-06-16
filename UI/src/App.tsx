import { useEffect, useState } from "react";

import "./App.css";
import ConnectButton from "./common/components/ConnectButton";
import { AppDispatch, useAppSelector } from "./state/store";
import { useDispatch } from "react-redux";
import { attachWallet } from "./state/services/wallet.service";
import VoteCard from "./common/components/VoteCard";
import { fetchVoteState } from "./state/services/contract.service";

function App() {
	const dispatch: AppDispatch = useDispatch();
	const candidates = useAppSelector((s) => s.contract.chandidates);
	let isVoted = useAppSelector((s) => s.contract.isVoted);
	let isConnected = useAppSelector((s) => s.wallet.isConnected);
	let account = useAppSelector((s) => s.wallet.accountAddress);

	useEffect(() => {
		dispatch(attachWallet());
	}, []);
	useEffect(() => {
		if (isConnected && account) dispatch(fetchVoteState());
	}, [isConnected, account]);
	return (
		<>
			<nav style={{ display: "flex", padding: "1rem" }}>
				<div style={{ fontSize: "1.3rem", fontWeight: 600 }} className="logo">
					CnC Voting Machine
				</div>
				<div style={{ flex: "1" }} className="spacer"></div>
				<ConnectButton></ConnectButton>
			</nav>
			<main>
				{isVoted && <h2 style={{ width: "fit-content", margin: "auto", marginBottom: "2rem" }}>You Have Already Voted</h2>}
				<div className="candidates" style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
					{candidates.map((c) => {
						return <VoteCard key={c.candidateId} id={c.candidateId} />;
					})}
				</div>
			</main>
		</>
	);
}

export default App;
