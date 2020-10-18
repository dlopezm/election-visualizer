import { Status } from './Status';

interface Vote {
    candidateName: string;
    candidateIndex: number;
    status: Status;
}
export interface Ballot {
    votes: Vote[];
}
