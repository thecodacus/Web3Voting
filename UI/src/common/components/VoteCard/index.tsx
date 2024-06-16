import React, { useEffect } from "react";
import { AppDispatch, useAppSelector } from "../../../state/store";
import styles from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { updateCandidateVote, voteForCandidate } from "../../../state/services/contract.service";

export default function VoteCard({ id }: { id: number }) {
	let candidate = useAppSelector((s) => s.contract.chandidates.find((x) => x.candidateId == id));
	let isConnected = useAppSelector((s) => s.wallet.isConnected);
	let isVoted = useAppSelector((s) => s.contract.isVoted);
	const dispatch: AppDispatch = useDispatch();
	useEffect(() => {
		if (isConnected && isVoted) dispatch(updateCandidateVote(id));
	}, [id, isConnected, isVoted]);

	return (
		<>
			{candidate && (
				<div className={styles.candidate}>
					<div className={styles.avatar} style={{ backgroundImage: `url("${candidate.avatarUrl}")` }}></div>
					<div className={styles.name}>{candidate.name}</div>
					<div className={styles.totalvotes}>Total Votes {candidate.voteCounter}</div>
					<div className={styles.voteBtn}>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (candidate) {
									dispatch(voteForCandidate(candidate.candidateId));
								}
							}}
							disabled={!isConnected || isVoted}
						>
							{isConnected ? <>Vote</> : <>Please Connect To Vote</>}
						</button>
					</div>
				</div>
			)}
		</>
	);
}
