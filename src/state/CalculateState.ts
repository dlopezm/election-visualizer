import cloneDeep from 'lodash.clonedeep';

import { NUM_ELECTED, NUM_VOTED, QUOTA_RATIO } from '../constants';
import { Ballot, Vote } from './Ballot';
import { Candidate } from './Candidate';
import { Phase } from './Election';
import { Status } from './Status';

function calculateNewPhase(
    candidates: Candidate[],
    ballots: Ballot[]
): { newCandidates: Candidate[]; newBallots: Ballot[] } {
    const candidateStateForThisPhase = candidates.map((candidate) => ({
        ...candidate,
        votesOnCurrentRound: Array(NUM_VOTED).fill(0),
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

function eliminateCandidate(phase: Phase): string {
    let eliminatedCandidateName: string | null = null;
    for (let i = phase.candidates.length - 1; i >= 0; --i) {
        if (phase.candidates[i].status === Status.active) {
            eliminatedCandidateName = phase.candidates[i].name;
            phase.candidates[i].status = Status.eliminated;
            phase.candidates[i].votesOnLastStage = phase.candidates[i].votesOnCurrentRound;
            break;
        }
    }

    if (!eliminatedCandidateName) {
        throw Error('Something went really wrong, no candidate could be eliminated');
    } else {
        phase.ballots.forEach((ballot) => {
            ballot.votes.forEach((vote) => {
                if (vote.candidateName === eliminatedCandidateName) {
                    vote.status = Status.eliminated;
                }
            });
        });

        return eliminatedCandidateName;
    }
}

export const calculateElection = (candidates: Candidate[], ballots: Ballot[]): Phase[] => {
    const autoElectQuota = Math.floor(ballots.length * QUOTA_RATIO) + 1; // strictly higher than the ratio
    console.log(`Any candidate with ${autoElectQuota} votes or more is automatically elected`);

    const phases: Phase[] = [];

    const { newCandidates, newBallots } = calculateNewPhase(candidates, ballots);

    phases.push({
        candidates: newCandidates,
        ballots: newBallots,
        info: `Any candidate with ${autoElectQuota} votes or more is automatically elected`,
    });

    while (
        phases[phases.length - 1].candidates.filter((candidate) => candidate.status === Status.elected).length <
        NUM_ELECTED
    ) {
        console.log('Phase', phases.length, 'starting');
        const phase = cloneDeep(phases[phases.length - 1]);
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
                    let activeCandidatesBeforeWinner = false;
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
                            if (!activeCandidatesBeforeWinner) {
                                votedForElectedCandidate = true;
                            }
                        }
                        if (vote.candidateName !== candidate.name && vote.status === Status.active) {
                            activeCandidatesBeforeWinner = true;
                        }
                    });
                });

                const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
                phases.push({
                    candidates: newCandidates,
                    ballots: newBallots,
                    info: `${candidate.name} had more than ${autoElectQuota} votes, so they were elected!`,
                });
            }
        }

        if (!someCandidateElectedThisPhase) {
            const eliminatedName = eliminateCandidate(phase);

            const { newCandidates, newBallots } = calculateNewPhase(phase.candidates, phase.ballots);
            phases.push({
                candidates: newCandidates,
                ballots: newBallots,
                info: `${eliminatedName} had the least votes, so they were eliminated!`,
            });
        }
    }
    return phases;
};
