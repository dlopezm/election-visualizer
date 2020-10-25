import React, { ReactElement } from 'react';
import FlipMove from 'react-flip-move';

import './components.css';
import { Candidate as CandidateType } from '../state/Candidate';
import { Candidate } from './Candidate';
import { range } from '../utils';
import { NUM_VOTED } from '../constants';

export interface Props {
    candidates: CandidateType[];
}

export class CandidateTable extends React.Component<Props> {
    render(): ReactElement {
        const { candidates } = this.props;

        return (
            <table className="candidateTable">
                <FlipMove>
                    <tr>
                        <th>Name</th>
                        {range(NUM_VOTED).map((index) => (
                            <th key={index}>{`Preference ${index + 1} votes`}</th>
                        ))}
                    </tr>
                    {candidates.map((candidate) => (
                        <Candidate key={candidate.name} candidate={candidate} />
                    ))}
                </FlipMove>
            </table>
        );
    }
}
