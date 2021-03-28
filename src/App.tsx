import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';

import './App.css';
import { Ballot as BallotType } from './state/Ballot';
import { Election } from './components/Election';
import { State } from './state/State';
import { Status } from './state/Status';
import { calculateElection } from './state/CalculateState';
import { range } from './utils';
import { ELECTIONS, NUM_VOTED } from './constants';
import { ElectionSelector } from './components/ElectionSelector';

function App(): ReactElement {
    const [fullState, setFullState] = useState<State>({ elections: [] });
    const [activeElectionIndex, setActiveElectionIndex] = useState<number>(0);
    useEffect(() => {
        async function getData(): Promise<void> {
            ELECTIONS.forEach(async ({ fileName, date }, index) => {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/${fileName}`);
                const text = await response.text();
                const parsed = csvParser.parse(text);

                const candidateNames = (parsed.data[0] as string[]).slice(1);

                const candidates = candidateNames.map((candidate) => {
                    const match = candidate.match(/\[(.*)\]/);
                    const name = match ? match[1] : '';
                    const splitName = name.split(' ');
                    const reorderedName = [
                        splitName[splitName.length - 1],
                        ...splitName.slice(0, splitName.length - 1),
                    ];
                    const finalName = reorderedName.join(' ');
                    return {
                        name: finalName,
                        status: Status.active,
                        votesOnCurrentRound: Array(NUM_VOTED).fill(0),
                    };
                });

                const rawBallots = (parsed.data as string[][]).slice(1);
                const ballots = rawBallots.map(
                    (rawBallot): BallotType => {
                        const ballotWithoutTimestamp = rawBallot.slice(1);

                        const rankedCandidateNames = range(NUM_VOTED).map((number) => {
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
                const phases = calculateElection(candidates, ballots);
                fullState.elections[index] = {
                    date,
                    phases,
                };
                setFullState({ elections: fullState.elections });
            });
        }
        getData();
    }, []);

    const activeElection = fullState.elections[activeElectionIndex];
    return (
        <div className="App">
            <ElectionSelector
                elections={fullState.elections}
                setActiveIndex={setActiveElectionIndex}
                activeIndex={activeElectionIndex}
            />
            {activeElection && <Election election={activeElection} />}
        </div>
    );
}

export default App;
