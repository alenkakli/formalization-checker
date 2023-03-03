import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Formalization from './Formalization';
import {
  addNewFormalization,
  removeProposition,
  updateInformalValue,
  selectInformalValue,
  selectFormalizations
} from '../../redux/addExerciseSlice';


function Proposition({ i, value, formalizations, add, remove, update }) {
  const formalizationRemovable = formalizations.length > 1;
  const formalizations_list = formalizations.map((_x, j) =>
    <Formalization
      key={j}
      i={i}
      j={j}
      cannotBeRemoved={!formalizationRemovable}
    />
  );
  const propositionFeedback = (value === ""
    ? <Form.Control.Feedback type="invalid">
        This field cannot be empty
      </Form.Control.Feedback>
    : null
  );

  return (
    <div className="mb-4">
      <Form.Group className="clearfix mb-0" controlId={`proposition-${i}`}>
        <h5><Form.Label className="d-block">
          Proposition {i + 1}
        </Form.Label></h5>
        <Form.Control
          type="text"
          placeholder="Enter proposition"
          value={value}
          onChange={(e) => update(e.target.value, i)}
          isInvalid={!!propositionFeedback}
        />
        <Button
          className="mt-1 mb-1 float-right"
          variant="outline-danger"
          size="sm"
          onClick={() => remove(i)}
        >
          Remove proposition {i + 1}
        </Button>
        {propositionFeedback}
      </Form.Group>
      <ol className="list-unstyled pl-5">
        { formalizations_list }
      </ol>
      <div className="pl-5 mb-3">
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => add(i)}
        >
          Add formalization
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: selectInformalValue(state, ownProps.i),
    formalizations: selectFormalizations(state, ownProps.i)
  };
};

const mapDispatchToProps = {
  add: addNewFormalization,
  remove: removeProposition,
  update: updateInformalValue
};

export default connect(mapStateToProps, mapDispatchToProps)(Proposition);
