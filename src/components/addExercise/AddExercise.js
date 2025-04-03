import React from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  addNewExercise,
  checkExercise,
  selectExerciseTitle,
  selectParser
} from '../../redux/addExerciseSlice';
import LanguageSection from './LanguageSection';
import PropositionsSection from './PropositionsSection';
import ExerciseTitle from './ExerciseTitle';
import Description from './Description';
import SaveButtonGroup from './SaveButtonGroup';
import ParserSelection from './ParserSelection';

function AddExercise({ status, error, containsErrors, title, addExercise, added}) {
  let content = null;
  if (status === 'idle') {
      if (added) {
          content = (
              <Alert variant="success">
                  Exercise <b>{ title }</b> was successfully added to the database.
              </Alert>
              );
      }
      else{
          content = (      <Form>
                  <h1>Add exercise</h1>
                  <ExerciseTitle />
                  <Description />
                  <LanguageSection />
                  <ParserSelection />
                  <PropositionsSection />
                  <SaveButtonGroup
                    containsErrors={containsErrors}
                    saveExercise={addExercise}
                  />
              </Form>
          );
      }
  } else if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
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
    added: state.addExercise.added,
    error: state.addExercise.error,
    containsErrors: checkExercise(state),
    title: selectExerciseTitle(state).value,
    selectedParser: selectParser(state).value
  };
};

const mapDispatchToProps = { addExercise: addNewExercise };

export default connect(mapStateToProps, mapDispatchToProps)(AddExercise);
