import React, { ReactElement } from 'react';
import './components.css';
import { Candidate as CandidateType } from '../state/Candidate';
import { Status } from '../state/Status';
import { formatNumber } from '../utils';

export interface Props {
    candidate: CandidateType;
}

export class Candidate extends React.Component<Props> {
    render(): ReactElement {
        const { candidate } = this.props;

        const votesToRender = candidate.votesOnLastStage ? candidate.votesOnLastStage : candidate.votesOnCurrentRound;
        return (
            <tr
                key={candidate.name}
                className={
                    candidate.status === Status.eliminated
                        ? 'eliminated'
                        : candidate.status === Status.elected
                        ? 'elected'
                        : undefined
                }
            >
                <td>{candidate.name}</td>
                {votesToRender.map((value, index) => (
                    <td key={index}>{formatNumber(value, 3)}</td>
                ))}
            </tr>
        );
    }
}
