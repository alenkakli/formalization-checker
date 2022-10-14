import React from 'react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  updateExerciseTitle,
  selectExerciseTitle
} from '../../redux/addExerciseSlice';


function ExerciseTitle({ value, update }) {
  return (
    <Form.Group>
      <Form.Label>
          Exercise title:
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter exercise title"
        value={value}
        onChange={(e) => update(e.target.value)}

      />
      { value === "" ?
        <Form.Text className="mb-3 text-danger">
          This field cannot be empty
        </Form.Text>
        : null
      }
    </Form.Group>
  );
}

const mapStateToProps = selectExerciseTitle;

const mapDispatchToProps = { update: updateExerciseTitle };

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseTitle);
