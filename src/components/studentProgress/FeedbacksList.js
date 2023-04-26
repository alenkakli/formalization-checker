import React from 'react';

export const FeedbacksList = ({ exercise_id, proposition_id, feedback }) => {
    return (
        <a href={`/bad_formalizations/${exercise_id}/${proposition_id}`}>{feedback.slice(0, 25)}</a>
    )
}
