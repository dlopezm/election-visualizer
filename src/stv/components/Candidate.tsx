import React, { ReactElement } from 'react';
import '../../components.css';
import { Candidate as CandidateType } from '../state/Candidate';
import { Status } from '../state/Status';
import { formatNumber } from '../../utils';

export interface Props {
    candidate: CandidateType;
    expanded: boolean;
}

export class Candidate extends React.Component<Props> {
    render(): ReactElement {
        const { candidate, expanded } = this.props;

        let votesToRender = candidate.votesOnLastStage ? candidate.votesOnLastStage : candidate.votesOnCurrentRound;
        if (!expanded) {
            votesToRender = votesToRender.slice(0, 1);
        }
        return (
            <tr
                key={candidate.name}
                className={`${
                    candidate.status === Status.eliminated
                        ? 'eliminated'
                        : candidate.status === Status.elected
                        ? 'elected'
                        : undefined
                } animated`}
            >
                <td>{candidate.name}</td>
                {votesToRender.map((value, index) => (
                    <td key={index}>{formatNumber(value, 3)}</td>
                ))}
                {expanded && <td key={'total'}>{votesToRender.reduce((acc, vote) => acc + vote, 0)}</td>}
            </tr>
        );
    }
}
