import React, { ReactElement } from 'react';

import '../../components.css';
import { BallotState, CandidateState } from '../state/ScoreVotingElection';
import { cloneDeep } from 'lodash';

export interface Props {
    ballots: BallotState[];
    candidates: CandidateState[];
}

export function BallotTable(props: Props): ReactElement {
    const { ballots, candidates } = props;

    const candidatesInOrder = cloneDeep(candidates).sort((a, b) => a.originalOrder - b.originalOrder);
    return (
        <div className="ballotTableWrapper">
            <table className="ballotTable">
                <tr>
                    {candidatesInOrder.map((candidatesInOrder) => (
                        <th key={candidatesInOrder.name}>{candidatesInOrder.name}</th>
                    ))}
                </tr>
                {ballots.map((ballot, index) => (
                    <tr key={index}>
                        {ballot.map((score, index) => (
                            <td key={index}>{score ?? '-'}</td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
    );
}
