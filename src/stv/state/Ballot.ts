import { Status } from './Status';

export interface Vote {
    candidateName: string;
    status: Status;
    value: number;
}
export interface Ballot {
    votes: Vote[];
}
