import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    selectFeedbacks, selectFeedbacksStatus, selectFeedbacksError
} from '../../redux/solveExerciseSlice';

// TODO, zobrazovanie feedbacku pre studenta v procese
function Feedback({ feedbacks, status, error }) {
    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        console.log(feedbacks)
        if (feedbacks.length > 0) {
            content = (
                <Alert variant="info">
                    <div className='d-inline-block mr-2'> 1 / {feedbacks.length} </div>
                    <div className='d-inline-block'> {feedbacks[0].feedback} </div>
                </Alert>
            );
        }
    } else if (status === 'failed') {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return content;
}

const mapStateToProps = (state, ownProps) => {
    return {
        feedbacks: selectFeedbacks(state, ownProps.proposition_id),
        status: selectFeedbacksStatus(state, ownProps.proposition_id),
        error: selectFeedbacksError(state, ownProps.proposition_id)
    };
};

export default connect(mapStateToProps)(Feedback);
