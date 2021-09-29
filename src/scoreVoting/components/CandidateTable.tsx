import React, { ReactElement, useState } from 'react';

import '../../components.css';
import { Candidate } from './Candidate';
import { CandidateState, MAX_SCORE } from '../state/ScoreVotingElection';
import { range } from '../../utils';

export interface Props {
    candidates: CandidateState[];
}

export function CandidateTable(props: Props): ReactElement {
    const [expanded, setExpanded] = useState<boolean>(false);
    const { candidates } = props;
    const scores = range(MAX_SCORE);

    return (
        <div className="candidateTableWrapper">
            <table className="candidateTable">
                <tr>
                    <th>Candidate</th>
                    {<th>Average score</th>}
                    {expanded && scores.map((index) => <th key={index}>{`${index + 1} ⭐`}</th>)}
                    {expanded && <th>No Opinion</th>}
                </tr>
                {candidates.map((candidate) => (
                    <Candidate key={candidate.name} candidate={candidate} expanded={expanded} />
                ))}
            </table>

            <button className="expandButton" onClick={(): void => setExpanded((current) => !current)}>
                {expanded ? '<' : '...'}
            </button>
        </div>
    );
}
