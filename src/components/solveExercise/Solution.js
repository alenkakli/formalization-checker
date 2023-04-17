import React from 'react';
import {Form, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import SyntaxError from '../addExercise/SyntaxError';
import Evaluation from './Evaluation';
import {
    update,
    evaluate,
    feedback,
    selectSolution
} from '../../redux/solveExerciseSlice';
import Feedback from "./Feedback";


function Solution({ exercise_id, proposition_id, proposition,
                    value, error, update, evaluate, user, onChange }) {

  const handleChange = (value) => {
    update(value, proposition_id);
    onChange && onChange(value, proposition_id);
  }

  return (
    <Form.Group
      className="clearfix"
      controlId={`formalization-${exercise_id}-${proposition_id}`}
    >
      <Form.Label>
        { proposition }
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter formalization"
        as="textarea"
        rows={1}
        value={value}
        isInvalid={!!error}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Button
        className="mt-1 float-right"
        variant="primary"
        disabled={error}
        onClick={() => evaluate({
          exercise_id,
          proposition_id,
          solution: value,
          user: user
        })}
      >
        Check
      </Button>
      <SyntaxError value={value} error={error} />
      <Evaluation proposition_id={proposition_id} />
    </Form.Group>
  );
}

const mapStateToProps = (state, ownProps) => {
  return selectSolution(state, ownProps.proposition_id)
};

const mapDispatchToProps = { update, evaluate, feedback };

export default connect(mapStateToProps, mapDispatchToProps)(Solution);
