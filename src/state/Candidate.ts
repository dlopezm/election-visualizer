import { Status } from './Status';

export interface Candidate {
    name: string;
    status: Status;
    votesOnCurrentRound: number[];
    votesOnLastStage?: number[];
    positionWhenElected?: number;
}
