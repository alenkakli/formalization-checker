import React from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    saveExercise,
    removeExercise,
  checkExercise,
  selectExerciseTitle
} from '../../redux/addExerciseSlice';
import LanguageSection from '../addExercise/LanguageSection';
import PropositionsSection from '../addExercise/PropositionsSection';
import ExerciseTitle from '../addExercise/ExerciseTitle';
import Description from '../addExercise/Description';


function EditExercise({ status, error, containsErrors, removeExercise, saveExercise }) {
  let content = null;
  if (status === 'idle') {
    content = (
      <Form>
        <h2>Add exercise</h2>
        <ExerciseTitle />
        <Description />
        <LanguageSection />
        <PropositionsSection />
        <Button
          className="mt-4 mb-5 float-right clearfix"
          variant="primary"
          size="lg"
          disabled={containsErrors}
          onClick={saveExercise}
        >
          Save exercise
        </Button>
          <Button
              className="mt-4 mb-5 float-left clearfix"
              variant="danger"
              size="lg"
              disabled={containsErrors}
              onClick={removeExercise}
          >
               Remove exercise
          </Button>
      </Form>
    );
  } else if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    content = (
      <Alert variant="success">
        Exercise  was succefully changed to the database.
      </Alert>
    );
  }else if (status === 'removed') {
    content = (
      <Alert variant="success">
        Exercise  was succefully removed from database.
      </Alert>
    );
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return content;
}

const mapStateToProps = (state) => {
  return {
    status: state.addExercise.status,
    error: state.addExercise.error,
    containsErrors: checkExercise(state),
    title: selectExerciseTitle(state).value
  };
};

const mapDispatchToProps = {saveExercise, removeExercise };

export default connect(mapStateToProps, mapDispatchToProps)(EditExercise);
