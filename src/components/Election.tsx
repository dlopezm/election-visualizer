import React, { ReactElement, useState } from 'react';

import { Ballot } from './Ballot';
import { Election as ElectionType } from './../state/Election';
import { CandidateTable } from './CandidateTable';

interface Props {
    election: ElectionType;
}

export function Election(props: Props): ReactElement {
    const { election } = props;
    const [phase, setPhase] = useState<number>(0);

    function incrementPhase(): void {
        setPhase(Math.min(election.phases.length - 1, phase + 1));
    }

    function decrementPhase(): void {
        setPhase(Math.max(0, phase - 1));
    }

    const activePhase = election.phases[phase];
    return (
        <>
            <div>{activePhase && <CandidateTable candidates={activePhase.candidates}></CandidateTable>}</div>
            <div className="info">{activePhase && activePhase.info}</div>
            <div>
                <button onClick={decrementPhase} disabled={phase === 0}>
                    Previous phase
                </button>
                <button onClick={incrementPhase} disabled={phase === election.phases.length - 1}>
                    Next phase
                </button>
            </div>
            <div>
                {election.phases[phase] &&
                    election.phases[phase].ballots.map((ballot, index) => <Ballot key={index} ballot={ballot} />)}
            </div>
        </>
    );
}
