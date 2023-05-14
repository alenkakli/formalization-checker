import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

export const FeedbacksList = ({ exercise_id, proposition_id, solution_id, feedback_id, feedback }) => {
    return (
        <Link to={`/bad_formalizations/${exercise_id}/${proposition_id}#${feedback_id}`} key={solution_id}>
            {feedback.slice(0, 25)}
        </Link>
    )
}
