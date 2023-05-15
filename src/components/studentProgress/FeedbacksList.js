import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {connect} from "react-redux";
import {selectIsAdmin} from "../../redux/userSlice";

function FeedbacksList({ isAdmin, exercise_id, proposition_id, solution_id, feedback_id, feedback }) {
    if (isAdmin) {
        return (
            <Link to={`/bad_formalizations/${exercise_id}/${proposition_id}#${feedback_id}`} key={solution_id}>
                {feedback.slice(0, 25)}
            </Link>
        )
    }
    return (
        <span>
            {feedback.slice(0, 25)}
        </span>
    )
}

const mapStateToProps = (state) => {
    return {
        isAdmin: selectIsAdmin(state),
    };
};


export default connect(mapStateToProps, null)(FeedbacksList);
