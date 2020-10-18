import React, { ReactElement } from 'react';
import './Candidate.css';
import { Candidate as CandidateType } from '../state/Candidate';
import { Status } from '../state/Status';

export interface Props {
    candidate: CandidateType;
}

export function Candidate(props: Props): ReactElement {
    const { candidate } = props;
    return (
        <div className={candidate.status === Status.eliminated ? 'eliminated' : undefined}>
            <span>{candidate.name}</span>: <span>{candidate.votesOnCurrentRound.join(' ')}</span>
        </div>
    );
}
