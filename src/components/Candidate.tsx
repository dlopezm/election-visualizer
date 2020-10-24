import React, { ReactElement } from 'react';
import './Candidate.css';
import { Candidate as CandidateType } from '../state/Candidate';
import { Status } from '../state/Status';
import { formatNumber } from '../utils';

export interface Props {
    candidate: CandidateType;
}

export function Candidate(props: Props): ReactElement {
    const { candidate } = props;
    return (
        <div
            className={
                candidate.status === Status.eliminated
                    ? 'eliminated'
                    : candidate.status === Status.elected
                    ? 'elected'
                    : undefined
            }
        >
            <span>{candidate.name}</span>:{' '}
            <span>
                {candidate.votesWhenElected
                    ? formatNumber(candidate.votesWhenElected, 3)
                    : candidate.votesOnCurrentRound.map((value) => formatNumber(value, 3)).join(' ')}
            </span>
        </div>
    );
}
