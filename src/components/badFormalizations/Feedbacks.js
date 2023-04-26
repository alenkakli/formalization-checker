import React from 'react';
import {ListGroup, Spinner} from 'react-bootstrap';
import {HandThumbsDownFill, HandThumbsUpFill} from "react-bootstrap-icons";
import {useGetFeedbacksQuery} from "../../redux/feedbacksSlice";
import {AddFeedback} from "./AddFeedback";
import {Checkbox} from "./Checkbox";
import QueryError from '../common/QueryError';

export const Feedbacks = ({ i, bad_formalization_id }) => {
    const {
        data: feedback,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetFeedbacksQuery({bad_formalization_id}, {refetchOnMountOrArgChange: true })

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
                    <div>shown: {f.shown}, rating: <HandThumbsUpFill/>{f.likes}, <HandThumbsDownFill/>{f.dislikes}</div>
                </ListGroup.Item>
            )
        });

    } else if (isError) {
        content = (
            <QueryError as={ListGroup.Item} error={error} />
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
