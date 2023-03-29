import React from 'react';
import {Alert, ListGroup, Spinner} from 'react-bootstrap';
import {useGetFeedbackQuery} from "../../redux/apiSlice";
import {AddFeedback} from "./AddFeedback";
import {Checkbox} from "./Checkbox";

export const Feedbacks = ({ i, bad_formalization_id }) => {
    const {
        data: feedback,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetFeedbackQuery(bad_formalization_id)

    let content

    if (isFetching) {
        content = <Spinner animation="border" variant="primary" />;
    } else if (isSuccess) {

        content = feedback.map((f) => {
            return (
                <ListGroup.Item as="li">
                    <div className="d-flex justify-content-between">
                        {f.author}
                        <Checkbox id={f.feedback_id} value={f.active}/>
                    </div>
                    <div>{f.feedback}</div>
                    <div>shown... , rating...</div>
                </ListGroup.Item>
            )
        });

    } else if (isError) {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return (
        <div className="clearfix">
            <h5 className="mt-2 px-4">Feedback</h5>
            <ListGroup as="ol">
                { content }
            </ListGroup>
            <AddFeedback key={i} bad_formalization_id={bad_formalization_id} />
        </div>
    );

}
