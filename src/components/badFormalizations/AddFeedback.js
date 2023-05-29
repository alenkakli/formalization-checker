import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useAddFeedbackMutation} from "../../redux/feedbacksSlice";

export const AddFeedback = ({ bad_formalization_id}) => {
    const [feedback, setFeedback] = useState('')
    const [addFeedback] = useAddFeedbackMutation()

    const onSubmit = async () => {
        setFeedback('')
        await addFeedback({ feedback: feedback, bad_formalization_id }).unwrap()
    };

    return (
        <div className="clearfix mt-2">
            <h6 className="my-2 px-4">Add feedback</h6>
            <Form.Group className="clearfix px-4 pb-1">
                <Form.Control
                    className="mr-2"
                    type="text"
                    as="textarea"
                    rows={2}
                    placeholder="Enter feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                    className="mt-2 float-right"
                    variant="primary"
                    size="sm"
                    onClick={onSubmit}
                >
                    Add
                </Button>
            </Form.Group>
        </div>
    );

}
