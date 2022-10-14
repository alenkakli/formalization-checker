import React from 'react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import SyntaxError from './SyntaxError';
import {
    selectConstraint, updateConstraint
} from '../../redux/addExerciseSlice';


function Constraint({ value, error, update }) {
  return (
    <Form.Group>
      <Form.Label>
        Preferred model constraints(optional):
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter constraints"
        value={value}
        onChange={(e) => update(e.target.value)}
      />
      <SyntaxError value={value} error={error} />
    </Form.Group>
  );
}

const mapStateToProps = selectConstraint;

const mapDispatchToProps = { update: updateConstraint };

export default connect(mapStateToProps, mapDispatchToProps)(Constraint);
