import cloneDeep from 'lodash.clonedeep';

import { NUM_ELECTED, QUOTA_RATIO } from '../constants';
import { Ballot, Vote } from './Ballot';
import { Candidate } from './Candidate';
import { Phase, State } from './State';
import { Status } from './Status';

function calculateNewPhase(
    candidates: Candidate[],
    ballots: Ballot[]
): { newCandidates: Candidate[]; newBallots: Ballot[] } {
    const candidateStateForThisPhase = candidates.map((candidate) => ({
        ...candidate,
        votesOnCurrentRound: Array(NUM_ELECTED).fill(0),
    }));
    ballots.forEach((ballot) => {
        const preferences = ballot.votes.reduce((acc, vote) => {
            const candidate = candidateStateForThisPhase.find((candidate) => candidate.name === vote.candidateName);
            if (!candidate) {
                console.error(
                    `Something went horribly wrong, trying to assing a vote to candidate ${vote.candidateName}, but it was not found on the candidate list`
                );
            } else if (vote.status === Status.active) {
                acc.push(vote);
            }
            return acc;
        }, new Array<Vote>());
        preferences.forEach((vote, index) => {
            const votedCandidate = candidateStateForThisPhase.find(
                (candidate) => candidate.name === vote.candidateName
            );
            if (votedCandidate) {
                votedCandidate.votesOnCurrentRound[index] += vote.value;
            } else {
                // doing this mostly to keep the very strict eslint happy
                console.error(
                    `Something went horribly wrong, trying to assing a vote to candidate ${vote.candidateName}, but it was not found on the candidate list`
                );
            }
        });
    });

    candidateStateForThisPhase.sort((a, b) => {
        if (a.positionWhenElected !== undefined && b.positionWhenElected !== undefined) {
            return a.positionWhenElected - b.positionWhenElected;
        }
        if (a.positionWhenElected !== undefined && b.positionWhenElected === undefined) {
            return -1;
        }
        if (a.positionWhenElected === undefined && b.positionWhenElected !== undefined) {
            return 1;
        }
        for (let i = 0; i < a.votesOnCurrentRound.length; ++i) {
            const result = b.votesOnCurrentRound[i] - a.votesOnCurrentRound[i];
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    });
    return { newCandidates: candidateStateForThisPhase, newBallots: ballots };
}

function eliminateCandidate(phase: Phase): void {
    let eliminatedCandidateName: string | null = null;
    for (let i = phase.candidates.length - 1; i >= 0; --i) {
        if (phase.candidates[i].status === Status.active) {
            eliminatedCandidateName = phase.candidates[i].name;
            phase.candidates[i].status = Status.eliminated;
            phase.candidates[i].votesOnLastStage = phase.candidates[i].votesOnCurrentRound;
            break;
        }
    }

    phase.ballots.forEach((ballot) => {
        ballot.votes.forEach((vote) => {
            if (vote.candidateName === eliminatedCandidateName) {
                vote.status = Status.eliminated;
            }
        });
    });
}

export const calculateState = (candidates: Candidate[], ballots: Ballot[]): State => {
    const autoElectQuota = Math.ceil(ballots.length * QUOTA_RATIO);
    console.log(`Any candidate with ${autoElectQuota} votes or more is automatically elected`);

    const state: State = { phases: [], activePhase: 0 };

    const { newCandidates, newBallots } = calculateNewPhase(candidates, ballots);

    state.phases.push({
        candidates: newCandidates,
        ballots: newBallots,
    });

    while (
        state.phases[state.phases.length - 1].candidates.filter((candidate) => candidate.status === Status.elected)
            .length < NUM_ELECTED
    ) {
        console.log('Phase', state.phases.length, 'starting');
        const phase = cloneDeep(state.phases[state.phases.length - 1]);
        let someCandidateElectedThisPhase = false;

        for (let i = 0; i < phase.candidates.length && !someCandidateElectedThisPhase; ++i) {
            const candidate = phase.candidates[i];
            const activeCandidateVotes = candidate.votesOnCurrentRound[0];
            if (candidate.status !== Status.elected && activeCandidateVotes >= autoElectQuota) {
                phase.candidates[i].status = Status.elected;
                phase.candidates[i].votesOnLastStage = candidate.votesOnCurrentRound;
                phase.candidates[i].positionWhenElected = i;
                someCandidateElectedThisPhase = true;
                console.log(`${candidate.name} elected!`);
                const extraVotesToDistribute = (activeCandidateVotes - autoElectQuota) / activeCandidateVotes;
                phase.ballots.forEach((ballot) => {
                    let votedForElectedCandidate = false;
                    let extraVotesDistributed = false;
                    ballot.votes.forEach((vote) => {
                        if (votedForElectedCandidate && !extraVotesDistributed) {
                            const candidateToDistributeVotesTo = phase.candidates.find(
                                (candidate) => candidate.name === vote.candidateName
                            );
                            if (candidateToDistributeVotesTo && candidateToDistributeVotesTo.status === Status.active) {
                                vote.value = extraVotesToDistribute;
                                extraVotesDistributed = true;
                            }
                        }
                        if (vote.candidateName === candidate.name) {
                            vote.status = Status.elected;
                            votedForElectedCandidate = true;
                        }
                    });
                });

                const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
                state.phases.push({
                    candidates: newCandidates,
                    ballots: newBallots,
                });
            }
        }

        if (!someCandidateElectedThisPhase) {
            eliminateCandidate(phase);

            const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
            state.phases.push({
                candidates: newCandidates,
                ballots: newBallots,
            });
        }
    }
    return state;
};
