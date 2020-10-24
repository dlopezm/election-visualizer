import React, { ReactElement } from 'react';
import './Ballot.css';
import { Ballot as BallotType } from '../state/Ballot';
import { Status } from '../state/Status';
import { formatNumber } from '../utils';

export interface Props {
    ballot: BallotType;
}

export function Ballot(props: Props): ReactElement {
    const { ballot } = props;
    return (
        <div className="Ballot">
            <ul>
                {ballot.votes.map((vote) => (
                    <li
                        key={vote.candidateName}
                        className={
                            vote.status === Status.eliminated
                                ? 'eliminated'
                                : vote.status === Status.elected
                                ? 'elected'
                                : undefined
                        }
                    >
                        {vote.candidateName}
                        {vote.value !== 1 ? `(${formatNumber(vote.value, 3)})` : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}
