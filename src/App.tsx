import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';

import './App.css';
import { Candidate } from './components/Candidate';
import { Ballot } from './components/Ballot';
import { Candidate as CandidateType } from './state/Candidate';
import { Ballot as BallotType } from './state/Ballot';

function App(): ReactElement {
    const [candidates, setCandidates] = useState<CandidateType[]>([]);
    const [ballots, setBallots] = useState<BallotType[]>([]);
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
                    votesOnCurrentRound: 0,
                };
            });
            setCandidates(candidates);

            const rawBallots = (parsed.data as string[][]).slice(1);
            const ballots = rawBallots.map((rawBallot) => {
                const ballotWithoutTimestamp = rawBallot.slice(1);

                const rankedCandidateNames = Array.from(Array(3).keys()).map(
                    (number) => {
                        const choiceIndex = ballotWithoutTimestamp.findIndex(
                            (choice) => choice.includes(String(number + 1))
                        );
                        const candidateName = candidates[choiceIndex].name;
                        return { name: candidateName, active: true };
                    }
                );

                return {
                    votes: rankedCandidateNames,
                };
            });

            setBallots(ballots);
        }
        getData();
    }, []);

    return (
        <div className="App">
            <div>
                {candidates.map((candidate) => (
                    <Candidate key={candidate.name} candidate={candidate} />
                ))}
            </div>
            <div>
                {ballots.map((ballot, index) => (
                    <Ballot key={index} ballot={ballot} />
                ))}
            </div>
        </div>
    );
}

export default App;
