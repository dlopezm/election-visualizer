import React, { ReactElement } from 'react';
import './Ballot.css';
import { Ballot as BallotType } from '../state/Ballot';

export interface Props {
    ballot: BallotType;
}

export function Ballot(props: Props): ReactElement {
    const { ballot } = props;
    return (
        <div className="Ballot">
            <ul>
                {ballot.votes.map((votedCandidate) => (
                    <li key={votedCandidate.name} className={votedCandidate.active ? undefined : 'eliminated'}>
                        {votedCandidate.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
