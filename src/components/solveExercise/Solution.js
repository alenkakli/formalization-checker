import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import SyntaxError from '../addExercise/SyntaxError';
import Evaluation from './Evaluation';
import {
  update,
  evaluate,
  selectSolution
} from '../../redux/solveExerciseSlice';


function Solution({ exercise_id, proposition_id, proposition,
                    value, error, update ,  evaluate, user}) {
  return (
    <div className="clearfix mt-4">
      <Form.Group className="clearfix">
        <Form.Label>
          { proposition }
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter formalization"
          as="textarea"
          rows={1}
          value={value}
          onChange={(e) => update(e.target.value, proposition_id)}
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
      </Form.Group>
      <Evaluation proposition_id={proposition_id} />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return selectSolution(state, ownProps.proposition_id);
};

const mapDispatchToProps = { update, evaluate };

export default connect(mapStateToProps, mapDispatchToProps)(Solution);
