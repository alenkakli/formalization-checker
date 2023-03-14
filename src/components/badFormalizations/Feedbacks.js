import React, {useEffect} from 'react';
import {Alert, Card, Form, ListGroup, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    fetchFeedbacksToBadFormalization, selectError,
    selectFeedbacks, selectStatus
} from "../../redux/exercisesSlice";
import AddFeedback from "./AddFeedback";

function Feedbacks({ i, len, bad_formalization_id, representative, feedbacks_list, status, error}) {
    // useEffect(() => {
    //     fetchFeedbacksToBadFormalization(bad_formalization_id);
    // }, []);

    console.log(representative)
    console.log(feedbacks_list)
    let feedbacks = representative.feedback.map((f) => (
    // let feedbacks = feedbacks_list.map((f) => (
        <ListGroup.Item as="li">
            <div className="d-flex justify-content-between">
                {f.author}
                <Form.Check
                    inline
                    type="checkbox"
                    label="Active"
                    defaultChecked={f.active}
                />
            </div>
            <div>{f.feedback}</div>
            <div>shown... , rating...</div>
        </ListGroup.Item>
    ));

    return (
        <div className="clearfix">
            <h5 className="mt-2 px-4">Feedback</h5>
            <ListGroup as="ol">
                { feedbacks }
            </ListGroup>
            <AddFeedback key={i} i={i} len={len} representative={representative} />
        </div>
    );

}

const mapStateToProps = (state) => {
    return {
        feedbacks_list: selectFeedbacks(state),
        status: selectStatus(state),
        error: selectError(state)
    };
};

const mapDispatchToProps = {
    // fetchFeedbacksToBadFormalization
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedbacks);
