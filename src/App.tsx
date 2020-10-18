import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';
import cloneDeep from 'lodash.clonedeep';

import './App.css';
import { Candidate } from './components/Candidate';
import { Ballot } from './components/Ballot';
import { Candidate as CandidateType } from './state/Candidate';
import { Ballot as BallotType } from './state/Ballot';
import { Phase, State } from './state/State';
import { NUM_ELECTED } from './constants';

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
            if (vote.active) {
                acc.push(vote.candidateName);
            }
            return acc;
        }, new Array<string>());
        preferences.forEach((candidateName, index) => {
            const votedCandidate = candidateStateForThisPhase.find((candidate) => candidate.name === candidateName);
            if (votedCandidate) {
                ++votedCandidate.votesOnCurrentRound[index];
            } else {
                // doing this mostly to keep the very strict eslint happy
                console.error(
                    `Something went horribly wrong, trying to assing a vote to candidate ${candidateName}, but it was not found on the candidate list`
                );
            }
        });
    });

    // ToDo: sort also by second and third preference votes
    candidateStateForThisPhase.sort((a, b) => {
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
        if (phase.candidates[i].active) {
            eliminatedCandidateName = phase.candidates[i].name;
            phase.candidates[i].active = false;
            break;
        }
    }

    phase.ballots.forEach((ballot) => {
        ballot.votes.forEach((vote) => {
            if (vote.candidateName === eliminatedCandidateName) {
                vote.active = false;
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
                    active: true,
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
                            candidateIndex: choiceIndex,
                            active: true,
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

            // ToDo: check for NUM_ELECTED people elected
            while (state.phases.length <= candidates.length - NUM_ELECTED) {
                const phase = cloneDeep(state.phases[state.phases.length - 1]);
                eliminateCandidate(phase);

                const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
                state.phases.push({
                    candidates: newCandidates,
                    ballots: newBallots,
                });
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
