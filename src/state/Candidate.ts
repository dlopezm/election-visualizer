import { Status } from './Status';

export interface Candidate {
    name: string;
    status: Status;
    votesOnCurrentRound: number[];
    votesWhenElected?: number;
    positionWhenElected?: number;
}
