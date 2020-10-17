import React, { ReactElement } from 'react';
import './App.css';
import { Candidate } from './components/Candidate';
import { Ballot } from './components/Ballot';

const candidates = [
    {
        name: 'A',
        active: true,
        votesOnCurrentRound: 4,
    },
    {
        name: 'B',
        active: true,
        votesOnCurrentRound: 8,
    },
    {
        name: 'C',
        active: false,
        votesOnCurrentRound: 0,
    },
    {
        name: 'D',
        active: true,
        votesOnCurrentRound: 9,
    },
];

const ballots = [
    {
        votes: [
            {
                name: 'D',
                active: true,
            },
            {
                name: 'B',
                active: true,
            },
            {
                name: 'C',
                active: false,
            },
        ],
    },
    {
        votes: [
            {
                name: 'B',
                active: true,
            },
            {
                name: 'A',
                active: true,
            },
            {
                name: 'C',
                active: false,
            },
        ],
    },
    {
        votes: [
            {
                name: 'D',
                active: true,
            },
            {
                name: 'C',
                active: false,
            },
            {
                name: 'A',
                active: true,
            },
        ],
    },
    {
        votes: [
            {
                name: 'B',
                active: true,
            },
            {
                name: 'A',
                active: true,
            },
            {
                name: 'C',
                active: false,
            },
        ],
    },
    {
        votes: [
            {
                name: 'C',
                active: false,
            },
            {
                name: 'D',
                active: true,
            },
            {
                name: 'A',
                active: true,
            },
        ],
    },
    {
        votes: [
            {
                name: 'D',
                active: true,
            },
            {
                name: 'A',
                active: true,
            },
            {
                name: 'B',
                active: true,
            },
        ],
    },
];

function App(): ReactElement {
    return (
        <div className="App">
            <div>
                {candidates.map((candidate) => (
                    <Candidate key={candidate.name} candidate={candidate} />
                ))}
            </div>
            <div>
                {ballots.map((ballot, index) => (
                    <Ballot key={index} ballot={ballot} />
                ))}
            </div>
        </div>
    );
}

export default App;
