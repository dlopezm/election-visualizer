import React, { ReactElement, useEffect, useState } from 'react';
import csvParser from 'papaparse';

import './App.css';
import { Election as STVElection } from './stv/components/Election';
import { Election as STVElectionState } from './stv/state/Election';
import { Election as ScoreVotingElection } from './scoreVoting/components/Election';
import { ScoreVotingElectionState } from './scoreVoting/state/ScoreVotingElection';

import { ElectionSelector } from './ElectionSelector';
import { ELECTIONS } from './elections';
import { calculateSTVElection } from './stv/CalculateSTVElection';
import { calculateScoreVotingElection } from './scoreVoting/CalculateScoreVotingElection';
import { ElectionList } from './types';

function App(): ReactElement {
    const [fullState, setFullState] = useState<ElectionList>({ elections: [] });
    const [activeElectionIndex, setActiveElectionIndex] = useState<number>(0);
    useEffect(() => {
        async function getData(): Promise<void> {
            ELECTIONS.forEach(async ({ fileName, title, system }, index) => {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/${fileName}`);
                const text = await response.text();
                const parsed = csvParser.parse(text);

                if (system === 'stv') {
                    const election = calculateSTVElection(title, parsed);
                    fullState.elections[index] = election;
                    setFullState({ elections: fullState.elections });
                } else if (system === 'score') {
                    const election: ScoreVotingElectionState = calculateScoreVotingElection(title, parsed);
                    fullState.elections[index] = election;
                    setFullState({ elections: fullState.elections });
                }
            });
        }
        getData();
    }, []);

    const activeElection = fullState.elections[activeElectionIndex];
    const activeElectionSystem = ELECTIONS[activeElectionIndex].system;
    return (
        <div className="App">
            <ElectionSelector
                elections={fullState.elections}
                setActiveIndex={setActiveElectionIndex}
                activeIndex={activeElectionIndex}
            />
            {activeElection &&
                (activeElectionSystem === 'stv' ? (
                    <STVElection election={activeElection as STVElectionState} />
                ) : (
                    <ScoreVotingElection election={activeElection as ScoreVotingElectionState} />
                ))}
        </div>
    );
}

export default App;
