import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {HandThumbsDownFill, HandThumbsUpFill} from "react-bootstrap-icons";
import {connect} from "react-redux";
import {selectIsAdmin} from "../../redux/userSlice";
import {useGetRatingQuery} from "../../redux/feedbacksSlice";

function FeedbacksList({ isAdmin, exercise_id, proposition_id, solution_id, feedback_id, feedback }) {
    const {
        data: rating
    } = useGetRatingQuery({solution_id, feedback_id})

    let rating_icon;
    switch( rating ) {
        case 1:
            rating_icon = <HandThumbsUpFill/>;
            break;
        case -1:
            rating_icon = <HandThumbsDownFill/>;
            break;
        default:
    }
    if (isAdmin) {
        return (
            <span>
                <Link to={`/bad_formalizations/${exercise_id}/${proposition_id}#${feedback_id}`} key={solution_id}>
                    {feedback.slice(0, 25) + "... "}
                </Link>
                {rating_icon}
            </span>
        )
    }
    return (
        <span>
            {feedback.slice(0, 25) + "... "}
            {rating_icon}
        </span>
    )
}

const mapStateToProps = (state) => {
    return {
        isAdmin: selectIsAdmin(state),
    };
};


export default connect(mapStateToProps, null)(FeedbacksList);
