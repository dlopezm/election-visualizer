import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';
import cloneDeep from 'lodash.clonedeep';

import './App.css';
import { Candidate } from './components/Candidate';
import { Ballot } from './components/Ballot';
import { Candidate as CandidateType } from './state/Candidate';
import { Ballot as BallotType, Vote } from './state/Ballot';
import { Phase, State } from './state/State';
import { NUM_ELECTED } from './constants';
import { Status } from './state/Status';

function calculateNewPhase(
    candidates: CandidateType[],
    ballots: BallotType[]
): { newCandidates: CandidateType[]; newBallots: BallotType[] } {
    const candidateStateForThisPhase = candidates.map((candidate) => ({
        ...candidate,
        votesOnCurrentRound: Array(NUM_ELECTED).fill(0),
    }));
    ballots.forEach((ballot) => {
        const preferences = ballot.votes.reduce((acc, vote) => {
            const candidate = candidateStateForThisPhase.find((candidate) => candidate.name === vote.candidateName);
            if (!candidate) {
                console.error(
                    `Something went horribly wrong, trying to assing a vote to candidate ${vote.candidateName}, but it was not found on the candidate list`
                );
            } else if (vote.status === Status.active) {
                acc.push(vote);
            }
            return acc;
        }, new Array<Vote>());
        preferences.forEach((vote, index) => {
            const votedCandidate = candidateStateForThisPhase.find(
                (candidate) => candidate.name === vote.candidateName
            );
            if (votedCandidate) {
                votedCandidate.votesOnCurrentRound[index] += vote.value;
            } else {
                // doing this mostly to keep the very strict eslint happy
                console.error(
                    `Something went horribly wrong, trying to assing a vote to candidate ${vote.candidateName}, but it was not found on the candidate list`
                );
            }
        });
    });

    candidateStateForThisPhase.sort((a, b) => {
        if (a.positionWhenElected !== undefined && b.positionWhenElected !== undefined) {
            return a.positionWhenElected - b.positionWhenElected;
        }
        if (a.positionWhenElected !== undefined && b.positionWhenElected === undefined) {
            return -1;
        }
        if (a.positionWhenElected === undefined && b.positionWhenElected !== undefined) {
            return 1;
        }
        for (let i = 0; i < a.votesOnCurrentRound.length; ++i) {
            const result = b.votesOnCurrentRound[i] - a.votesOnCurrentRound[i];
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
    return { newCandidates: candidateStateForThisPhase, newBallots: ballots };
}

function eliminateCandidate(phase: Phase): void {
    let eliminatedCandidateName: string | null = null;
    for (let i = phase.candidates.length - 1; i >= 0; --i) {
        if (phase.candidates[i].status === Status.active) {
            eliminatedCandidateName = phase.candidates[i].name;
            phase.candidates[i].status = Status.eliminated;
            break;
        }
    }

    phase.ballots.forEach((ballot) => {
        ballot.votes.forEach((vote) => {
            if (vote.candidateName === eliminatedCandidateName) {
                vote.status = Status.eliminated;
            }
        });
    });
}

function App(): ReactElement {
    const [fullState, setFullState] = useState<State>({ phases: [], activePhase: 0 });
    useEffect(() => {
        async function getData(): Promise<void> {
            const response = await fetch('/data/Inaugural_Ballot.csv');
            const text = await response.text();
            const parsed = csvParser.parse(text);

            const candidateNames = (parsed.data[0] as string[]).slice(1);

            const candidates = candidateNames.map((candidate) => {
                const match = candidate.match(/\[(.*)\]/);
                const name = match ? match[1] : '';
                return {
                    name,
                    status: Status.active,
                    votesOnCurrentRound: Array(NUM_ELECTED).fill(0),
                };
            });

            const rawBallots = (parsed.data as string[][]).slice(1);
            const ballots = rawBallots.map(
                (rawBallot): BallotType => {
                    const ballotWithoutTimestamp = rawBallot.slice(1);

                    const rankedCandidateNames = Array.from(Array(NUM_ELECTED).keys()).map((number) => {
                        const choiceIndex = ballotWithoutTimestamp.findIndex((choice) =>
                            choice.includes(String(number + 1))
                        );
                        const candidateName = candidates[choiceIndex].name;
                        return {
                            candidateName: candidateName,
                            status: Status.active,
                            value: 1,
                        };
                    });

                    return {
                        votes: rankedCandidateNames,
                    };
                }
            );

            const state: State = cloneDeep(fullState);

            const { newCandidates, newBallots } = calculateNewPhase(candidates, ballots);

            state.phases.push({
                candidates: newCandidates,
                ballots: newBallots,
            });

            while (
                state.phases[state.phases.length - 1].candidates.filter(
                    (candidate) => candidate.status === Status.elected
                ).length < NUM_ELECTED
            ) {
                console.log('Phase', state.phases.length, 'starting');
                const phase = cloneDeep(state.phases[state.phases.length - 1]);
                let someCandidateElectedThisPhase = false;

                for (let i = 0; i < phase.candidates.length && !someCandidateElectedThisPhase; ++i) {
                    const candidate = phase.candidates[i];
                    const activeCandidateVotes = candidate.votesOnCurrentRound[0];
                    const MIN_VOTES = 17;
                    if (candidate.status !== Status.elected && activeCandidateVotes >= MIN_VOTES) {
                        phase.candidates[i].status = Status.elected;
                        phase.candidates[i].votesWhenElected = activeCandidateVotes;
                        phase.candidates[i].positionWhenElected = i;
                        someCandidateElectedThisPhase = true;
                        console.log(`${candidate.name} elected!`);
                        const extraVotesToDistribute = (activeCandidateVotes - MIN_VOTES) / activeCandidateVotes;
                        phase.ballots.forEach((ballot) => {
                            let votedForElectedCandidate = false;
                            let extraVotesDistributed = false;
                            ballot.votes.forEach((vote) => {
                                if (votedForElectedCandidate && !extraVotesDistributed) {
                                    const candidateToDistributeVotesTo = phase.candidates.find(
                                        (candidate) => candidate.name === vote.candidateName
                                    );
                                    if (
                                        candidateToDistributeVotesTo &&
                                        candidateToDistributeVotesTo.status === Status.active
                                    ) {
                                        vote.value = extraVotesToDistribute;
                                        extraVotesDistributed = true;
                                    }
                                }
                                if (vote.candidateName === candidate.name) {
                                    vote.status = Status.elected;
                                    votedForElectedCandidate = true;
                                }
                            });
                        });

                        const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
                        state.phases.push({
                            candidates: newCandidates,
                            ballots: newBallots,
                        });
                    }
                }

                if (!someCandidateElectedThisPhase) {
                    eliminateCandidate(phase);

                    const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
                    state.phases.push({
                        candidates: newCandidates,
                        ballots: newBallots,
                    });
                }
            }

            setFullState(state);
        }
        getData();
    }, []);

    function incrementPhase(): void {
        setFullState({
            ...fullState,
            activePhase: Math.min(fullState.phases.length - 1, fullState.activePhase + 1),
        });
    }

    function decrementPhase(): void {
        setFullState({
            ...fullState,
            activePhase: Math.max(0, fullState.activePhase - 1),
        });
    }

    return (
        <div className="App">
            <div>
                {fullState.phases[fullState.activePhase] &&
                    fullState.phases[fullState.activePhase].candidates.map((candidate) => (
                        <Candidate key={candidate.name} candidate={candidate} />
                    ))}
            </div>
            <div>
                <button onClick={decrementPhase} disabled={fullState.activePhase === 0}>
                    Previous phase
                </button>
                <button onClick={incrementPhase} disabled={fullState.activePhase === fullState.phases.length - 1}>
                    Next phase
                </button>
            </div>
            <div>
                {fullState.phases[fullState.activePhase] &&
                    fullState.phases[fullState.activePhase].ballots.map((ballot, index) => (
                        <Ballot key={index} ballot={ballot} />
                    ))}
            </div>
        </div>
    );
}

export default App;
