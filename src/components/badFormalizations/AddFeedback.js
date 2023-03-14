import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    addFeedback,
    selectFeedbackText,
    updateFeedbackText,
    addToList, clearFeedbackText
} from "../../redux/exercisesSlice";

function AddFeedback({ i, len, representative, value, update, addFeedback, add, clear}) {
    add(len);
    return (
        <div className="clearfix mt-4">
            <h6 className="my-2 px-4">Add feedback</h6>
            <Form.Group className="clearfix px-4 pb-1">
                <Form.Control
                    className="mr-2"
                    type="text"
                    as="textarea"
                    rows={2}
                    placeholder="Enter exercise title"
                    value={value}
                    onChange={(e) => update(e.target.value, i)}
                />
                <Button
                    className="mt-2 float-right"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                        addFeedback({
                            bad_formalization_id: representative.bad_formalization_id, i
                        })
                        clear(i);
                    }}
                >
                    Add feedback
                </Button>
            </Form.Group>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => {
    return selectFeedbackText(state, ownProps.i);
};

const mapDispatchToProps = { addFeedback, update: updateFeedbackText, add: addToList, clear: clearFeedbackText };

export default connect(mapStateToProps, mapDispatchToProps)(AddFeedback);
