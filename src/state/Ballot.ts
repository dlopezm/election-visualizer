interface Vote {
    name: string;
    active: boolean;
}
export interface Ballot {
    votes: Vote[];
}
