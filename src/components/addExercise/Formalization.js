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


function Formalization({ i, j, value, value2, error, error2, remove, update, updateConstraints, cannotBeRemoved }) {
  const tag = `${i + 1}.${j + 1}`;
  const id = `-${i}-${j}`;
  return (
    <li className="clearfix mb-4">
      <Form.Group controlId={`formalization${id}`}>
        <Form.Label>
          {`Formalization ${tag}`}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter formalization"
          value={value}
          as="textarea"
          rows={1}
          onChange={(e) => update(e.target.value, i, j)}
          isInvalid={!!error}
        />
        <Button
          className="mt-1 float-right"
          variant="outline-danger"
          size="sm"
          onClick={() => remove(i, j)}
          disabled={cannotBeRemoved}
        >
          Remove formalization {tag}
        </Button>
        <SyntaxError value={value} error={error} />
      </Form.Group>

      <Form.Group controlId={`constraints${id}`} size="sm">
        <Form.Label>
          <small>Preferred model constraints {tag} (optional)</small>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter constraints"
          value={value2}
          as="textarea"
          size="sm"
          rows={1}
          onChange={(e) => updateConstraints(e.target.value, i, j)}
          isInvalid={!!error2}
        />
        <SyntaxError value={value2} error={error2} />
      </Form.Group>
    </li>
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
