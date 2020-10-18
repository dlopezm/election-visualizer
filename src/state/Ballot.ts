interface Vote {
    candidateName: string;
    candidateIndex: number;
    active: boolean;
}
export interface Ballot {
    votes: Vote[];
}
