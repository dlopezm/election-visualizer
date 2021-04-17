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

export interface State {
    expanded: boolean;
}

export class CandidateTable extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }

    render(): ReactElement {
        const { candidates } = this.props;
        const { expanded } = this.state;
        let votesToRender = range(NUM_VOTED);
        if (!expanded) {
            votesToRender = votesToRender.slice(0, 1);
        }
        return (
            <div className="candidateTableWrapper">
                <table className="candidateTable">
                    <tr>
                        <th>Candidate</th>
                        {votesToRender.map((index) => (
                            <th key={index}>{`Rank ${index + 1} votes`}</th>
                        ))}
                        {expanded && <th>Total</th>}
                    </tr>
                    {candidates.map((candidate) => (
                        <Candidate key={candidate.name} candidate={candidate} expanded={this.state.expanded} />
                    ))}
                </table>

                <button
                    className="expandButton"
                    onClick={(): void => this.setState({ expanded: !this.state.expanded })}
                >
                    {this.state.expanded ? '<' : '...'}
                </button>
            </div>
        );
    }
}
