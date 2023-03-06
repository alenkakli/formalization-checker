import React from 'react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  updateExerciseTitle,
  selectExerciseTitle
} from '../../redux/addExerciseSlice';


function ExerciseTitle({ value, update }) {
  const feedback = (value === "" ?
    <Form.Control.Feedback type="invalid">
      This field cannot be empty
    </Form.Control.Feedback>
    : null);

  return (
    <Form.Group controlId="exercise-title">
      <Form.Label>
          Exercise title
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter exercise title"
        value={value}
        isInvalid={!!feedback}
        onChange={(e) => update(e.target.value)}
      />
      {feedback}
    </Form.Group>
  );
}

const mapStateToProps = selectExerciseTitle;

const mapDispatchToProps = { update: updateExerciseTitle };

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseTitle);
