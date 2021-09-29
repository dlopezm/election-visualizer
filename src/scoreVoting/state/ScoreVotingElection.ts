export const MAX_SCORE = 5;

export interface CandidateState {
    name: string;
    votesPerScore: number[];
    averageScore: number;
    noOpVotes: number;
    originalOrder: number;
    isElected: boolean;
}

export type BallotState = Array<number | undefined>;

export interface ScoreVotingElectionState {
    title: string;
    candidates: CandidateState[];
    ballots: BallotState[];
}
