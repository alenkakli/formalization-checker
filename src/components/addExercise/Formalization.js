import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import SyntaxError from './SyntaxError';
import {
  removeFormalization,
  updateFormalization,
  selectFormalization,
  updateConstraints,  selectConstraints
} from '../../redux/addExerciseSlice';


function Formalization({ i, j, value, value2, error, error2, remove, update, updateConstraints }) {
  return (
    <div className="clearfix pl-5">
      <Form.Group className="mb-0">
        <Form.Label>
          {"Formalization " + (i + 1) + "." + (j + 1)}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter formalization"
          value={value}
          as="textarea"
          rows={1}
          onChange={(e) => update(e.target.value, i, j)}
        />
        <SyntaxError value={value} error={error} />

        <Form.Label>
          {"Preferred model constraints " + (i + 1) + "." + (j + 1) + "(optional)"}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter constraints"
          value={value2}
          as="textarea"
          rows={1}
          onChange={(e) => updateConstraints(e.target.value, i, j)}
        />
        <SyntaxError value={value2} error={error2} />
        <Button
          className="mt-1 float-right"
          variant="outline-danger"
          size="sm"
          onClick={() => remove(i, j)}
        >
          Remove
        </Button>
      </Form.Group>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const data = selectFormalization(state, ownProps.i, ownProps.j);
  const data2 = selectConstraints(state, ownProps.i, ownProps.j);
  return {
    value: data.value,
    error: data.error,
    value2: data2.value,
    error2: data2.error,
  };
};

const mapDispatchToProps = {
  remove: removeFormalization,
  update: updateFormalization,
  updateConstraints
};

export default connect(mapStateToProps, mapDispatchToProps)(Formalization);
