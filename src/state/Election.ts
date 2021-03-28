import { Ballot } from './Ballot';
import { Candidate } from './Candidate';

export interface Phase {
    candidates: Candidate[];
    ballots: Ballot[];
    info: string;
}

export interface Election {
    phases: Phase[];
    date: Date;
}
