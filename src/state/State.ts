import { Ballot } from './Ballot';
import { Candidate } from './Candidate';

interface Phase {
    candidates: Candidate[];
    ballots: Ballot[];
}

export interface State {
    phases: Phase[];
    activePhase: number;
}
