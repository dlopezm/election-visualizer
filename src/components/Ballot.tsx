import React, { ReactElement } from 'react';
import './Ballot.css';
import { Ballot as BallotType } from '../state/Ballot';
import { Status } from '../state/Status';

export interface Props {
    ballot: BallotType;
}

export function Ballot(props: Props): ReactElement {
    const { ballot } = props;
    return (
        <div className="Ballot">
            <ul>
                {ballot.votes.map((votedCandidate) => (
                    <li
                        key={votedCandidate.candidateName}
                        className={votedCandidate.status === Status.eliminated ? 'eliminated' : undefined}
                    >
                        {votedCandidate.candidateName}
                    </li>
                ))}
            </ul>
        </div>
    );
}
