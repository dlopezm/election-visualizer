import React, { ReactElement } from 'react';
import '../../components.css';
import { CandidateState } from '../state/ScoreVotingElection';
import { formatNumber } from '../../utils';

export interface Props {
    candidate: CandidateState;
    expanded: boolean;
}

export function Candidate(props: Props): ReactElement {
    const { candidate, expanded } = props;

    return (
        <tr key={candidate.name} className={`${candidate.isElected ? 'elected' : undefined} animated`}>
            <td>{candidate.name}</td>
            {formatNumber(candidate.averageScore, 3)}
            {expanded && candidate.votesPerScore.map((votes, index) => <td key={index}>{votes}</td>)}
            {expanded && <td key="noop">{candidate.noOpVotes}</td>}
        </tr>
    );
}
