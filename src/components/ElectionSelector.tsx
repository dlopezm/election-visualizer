import React, { ReactElement } from 'react';
import { Election as ElectionType } from './../state/Election';

interface Props {
    elections: ElectionType[];
    activeIndex: number;
    setActiveIndex: (index: number) => void;
}

export function ElectionSelector(props: Props): ReactElement {
    return (
        <div className="electionSelector">
            <span>
                <h3>Elections</h3>
            </span>
            {props.elections.map((election, index) => (
                <button
                    key={index}
                    onClick={(): void => props.setActiveIndex(index)}
                    disabled={index === props.activeIndex}
                >
                    {election.title}
                </button>
            ))}
        </div>
    );
}
