import csvParser from 'papaparse';
import { NUM_ELECTED } from '../stv/constants';
import { CandidateState, MAX_SCORE, ScoreVotingElectionState } from './state/ScoreVotingElection';

export function calculateScoreVotingElection(
    title: string,
    parsed: csvParser.ParseResult<unknown>
): ScoreVotingElectionState {
    const candidateNames = (parsed.data[0] as string[]).slice(1);

    const candidates: CandidateState[] = candidateNames.map((candidate, index) => {
        const match = candidate.match(/\[(.*)\]/);
        const name = match ? match[1] : '';

        return {
            name,
            votesPerScore: Array(MAX_SCORE).fill(0),
            originalOrder: index,
            averageScore: 0,
            noOpVotes: 0,
            isElected: false,
        };
    });

    const rawBallots = (parsed.data as string[][]).slice(1);

    const ballots = rawBallots.map((rawBallot): (number | undefined)[] => {
        const ballotWithoutTimestamp = rawBallot.slice(1);
        const parsedScore = ballotWithoutTimestamp.map((score) => {
            const match = score.match(/\((.*)\)/);
            return (match && Number(match[1])) || undefined;
        });
        return parsedScore;
    });

    ballots.forEach((ballot) => {
        ballot.forEach((vote, index) => {
            if (vote !== undefined) {
                candidates[index].votesPerScore[vote - 1] += 1;
            }
        });
    });

    candidates.forEach((candidate) => {
        const totalScore = candidate.votesPerScore.reduce((acc, numVotes, index) => {
            acc += numVotes * (index + 1);
            return acc;
        }, 0);

        const totalVotes = candidate.votesPerScore.reduce((acc, numVotes) => {
            acc += numVotes;
            return acc;
        }, 0);
        candidate.averageScore = totalScore / totalVotes;
        candidate.noOpVotes = ballots.length - totalVotes;
    });

    candidates.sort((a, b) => {
        if (a.averageScore !== b.averageScore) {
            return b.averageScore - a.averageScore;
        }
        if (a.noOpVotes !== b.noOpVotes) {
            return b.noOpVotes - a.noOpVotes;
        }
        for (let i = MAX_SCORE - 1; i <= 0; --i) {
            if (a.votesPerScore[i] !== b.votesPerScore[i]) {
                return b.votesPerScore[i] - a.votesPerScore[i];
            }
        }
        return 0;
    });

    candidates.forEach((candidate, index) => (candidate.isElected = index < NUM_ELECTED));

    return {
        title,
        candidates,
        ballots,
    };
}
