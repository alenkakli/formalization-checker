import React, {useState} from 'react';
import { Alert, Row, Col, Container} from 'react-bootstrap';
import {HandThumbsDown, HandThumbsDownFill, HandThumbsUp, HandThumbsUpFill} from "react-bootstrap-icons";
import {updateRating} from "../../redux/solveExerciseSlice";
import {connect} from "react-redux";

function Feedback({ feedback, updateRating }) {
    let content;
    const [activeBtn, setActiveBtn] = useState("none");
    const [thumbsUp, setThumbsUp] = useState(<HandThumbsUp/>);
    const [thumbsDown, setThumbsDown] = useState(<HandThumbsDown/>);

    const handleLikeClick = () => {
        if (activeBtn === "none" || activeBtn === "dislike") {
            setActiveBtn("like");
            setThumbsUp(<HandThumbsUpFill/>)
            setThumbsDown(<HandThumbsDown/>)
            updateRating({
                id: feedback.rating_id,
                rating: 1
            });
        } else if (activeBtn === 'like'){
            setActiveBtn("none");
            setThumbsUp(<HandThumbsUp/>)
            updateRating({
                id: feedback.rating_id,
                rating: 0
            });
        }
    };

    const handleDislikeClick = () => {
        if (activeBtn === "none" || activeBtn === "like") {
            setActiveBtn("dislike");
            setThumbsDown(<HandThumbsDownFill/>)
            setThumbsUp(<HandThumbsUp/>)
            updateRating({
                id: feedback.rating_id,
                rating: -1
            });
        } else if (activeBtn === 'dislike'){
            setActiveBtn("none");
            setThumbsDown(<HandThumbsDown/>)
            updateRating({
                id: feedback.rating_id,
                rating: 0
            });
        }
    };

    const like = (
        <button
            className={`btn ${activeBtn === "like" ? "like-active" : ""}`}
            key={feedback.feedback_id}
            onClick={handleLikeClick} >
            {thumbsUp}
        </button>
    )

    const dislike = (
        <button
            className={`btn ${activeBtn === "dislike" ? "dislike-active" : ""}`}
            key={feedback.feedback_id}
            onClick={handleDislikeClick} >
            {thumbsDown}
        </button>
    )

    content = (
        <Row className="p-0 mb-1">
            <Col className="p-0">
                <Alert variant="info" className="mb-0">
                    {feedback.feedback}
                </Alert>
            </Col>
            <Col className="p-0" md="auto">{like}</Col>
            <Col className="p-0" md="auto">{dislike}</Col>
        </Row>
    )

    return (
        <Container>
            { content }
        </Container>
    );
}

const mapDispatchToProps = { updateRating };

export default connect(null, mapDispatchToProps)(Feedback);