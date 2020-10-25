import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';

import './App.css';
import { Ballot } from './components/Ballot';
import { Ballot as BallotType } from './state/Ballot';
import { State } from './state/State';
import { NUM_ELECTED } from './constants';
import { Status } from './state/Status';
import { calculateState } from './state/CalculateState';
import { CandidateTable } from './components/CandidateTable';
import { range } from './utils';

function App(): ReactElement {
    const [fullState, setFullState] = useState<State>({ phases: [], activePhase: 0 });
    useEffect(() => {
        async function getData(): Promise<void> {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/Inaugural_Ballot.csv`);
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

                    const rankedCandidateNames = range(NUM_ELECTED).map((number) => {
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
            const state = calculateState(candidates, ballots);
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
                {fullState.phases[fullState.activePhase] && (
                    <>
                        <CandidateTable
                            candidates={fullState.phases[fullState.activePhase].candidates}
                        ></CandidateTable>
                    </>
                )}
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
