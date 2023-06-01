import React from 'react';
import {ListGroup, OverlayTrigger, Spinner} from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';
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
    } = useGetFeedbacksQuery(bad_formalization_id)

    let content

    if (isFetching) {
        content = <Spinner animation="border" variant="primary" />;
    } else if (isSuccess) {

        content = feedback.map((f) => {
            let likes_users;
            if (f.likes_users.length > 0) {
                likes_users = f.likes_users.map((user) => (
                    <div>{user.user_name}</div>
                ))
            }
            let dislikes_users;
            if (f.dislikes_users.length > 0) {
                dislikes_users = f.dislikes_users.map((user) => (
                    <div>{user.user_name}</div>
                ))
            }
            let shown_users;
            if (f.shown_users.length > 0) {
                shown_users = f.shown_users.map((user) => (
                    <div>{user.user_name}</div>
                ))
            }

            let likes = (f.likes > 0) ?
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="tooltip">
                            {likes_users}
                        </Tooltip>}>
                        <span><HandThumbsUpFill/>{f.likes}</span>
                    </OverlayTrigger> :
                    <span><HandThumbsUpFill/>{f.likes}</span>;

            let dislikes = (f.dislikes > 0) ?
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="tooltip">
                            {dislikes_users}
                        </Tooltip>}>
                        <span><HandThumbsDownFill/>{f.dislikes}</span>
                    </OverlayTrigger> :
                    <span><HandThumbsDownFill/>{f.dislikes}</span>;

            let shown = (f.shown > 0) ?
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="tooltip">
                            {shown_users}
                        </Tooltip>}>
                        <span>{f.shown}</span>
                    </OverlayTrigger> :
                    <span>{f.shown}</span>;

            return (
                <ListGroup.Item as="li" id={f.feedback_id}>
                    <div className="d-flex justify-content-between">
                        {f.author}
                        <Checkbox id={f.feedback_id} value={f.active} bad_formalization_id={bad_formalization_id}/>
                    </div>
                    <div>{f.feedback}</div>
                    <div>shown: {shown}, rating: {likes}, {dislikes}</div>
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
            <ListGroup as="ol" className="list-group-flush border-top border-bottom">
                { content }
            </ListGroup>
            <AddFeedback key={i} bad_formalization_id={bad_formalization_id} />
        </div>
    );

}
