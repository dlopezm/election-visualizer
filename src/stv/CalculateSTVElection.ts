import csvParser from 'papaparse';

import { range } from '../utils';
import { NUM_VOTED } from './constants';
import { calculateElection } from './state/CalculateState';
import { Election } from './state/Election';
import { Status } from './state/Status';
import { Ballot as BallotType } from './state/Ballot';

export function calculateSTVElection(title: string, parsed: csvParser.ParseResult<unknown>): Election {
    const candidateNames = (parsed.data[0] as string[]).slice(1);

    const candidates = candidateNames.map((candidate) => {
        const match = candidate.match(/\[(.*)\]/);
        const name = match ? match[1] : '';
        const splitName = name.split(' ');
        const reorderedName = [splitName[splitName.length - 1], ...splitName.slice(0, splitName.length - 1)];
        const finalName = reorderedName.join(' ');
        return {
            name: finalName,
            status: Status.active,
            votesOnCurrentRound: Array(NUM_VOTED).fill(0),
        };
    });

    const rawBallots = (parsed.data as string[][]).slice(1);
    const ballots = rawBallots.map(
        (rawBallot): BallotType => {
            const ballotWithoutTimestamp = rawBallot.slice(1);

            const rankedCandidateNames = range(NUM_VOTED).map((number) => {
                const choiceIndex = ballotWithoutTimestamp.findIndex((choice) => choice.includes(String(number + 1)));
                const candidateName = candidates[choiceIndex].name;
                return {
                    candidateName: candidateName,
                    status: Status.active,
                    value: 1,
                };
            });

            return {
                votes: rankedCandidateNames,
            };
        }
    );
    const phases = calculateElection(candidates, ballots);

    return {
        title,
        phases,
    };
}
