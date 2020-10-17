import React, { ReactElement } from 'react';
import './Candidate.css';
import { Candidate as CandidateType } from '../state/Candidate';

export interface Props {
    candidate: CandidateType;
}

export function Candidate(props: Props): ReactElement {
    const { candidate } = props;
    return (
        <div className={candidate.active ? undefined : 'eliminated'}>
            <span>{candidate.name}</span>:{' '}
            <span>{candidate.votesOnCurrentRound}</span>
        </div>
    );
}
