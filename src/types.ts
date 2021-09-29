import { Election as STVElection } from './stv/state/Election';
import { ScoreVotingElectionState } from './scoreVoting/state/ScoreVotingElection';

export type ElectionResult = STVElection | ScoreVotingElectionState;

export interface ElectionList {
    elections: ElectionResult[];
}
