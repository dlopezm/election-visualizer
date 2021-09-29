import React, { ReactElement } from 'react';

import { ScoreVotingElectionState } from '../state/ScoreVotingElection';
import { BallotTable } from './BallotTable';
import { CandidateTable } from './CandidateTable';

interface Props {
    election: ScoreVotingElectionState;
}

export function Election(props: Props): ReactElement {
    const { election } = props;

    return (
        <>
            <div>{<CandidateTable candidates={election.candidates} />}</div>
            <div>{<BallotTable ballots={election.ballots} candidates={election.candidates} />}</div>
        </>
    );
}
