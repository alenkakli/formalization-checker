import React from 'react';
import { Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
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
import SaveButtonGroup from '../addExercise/SaveButtonGroup';

function EditExercise({ status, error, title, containsErrors, removeExercise, saveExercise }) {
  let content = null;
  if (status === 'idle') {
    content = (
      <Form>
        <h1>Editing <i>{title}</i></h1>
        <ExerciseTitle />
        <Description />
        <LanguageSection />
        <PropositionsSection />
        <Row className="justify-content-end">
          <Col xs={12} md={{order: 2, span: 4}}>
            <SaveButtonGroup
              containsErrors={containsErrors}
              saveExercise={saveExercise}
            />
          </Col>
          <Col xs={12} md={{order:1, span: 4, offset: 4}} className="text-center">
            <Button
                variant="outline-danger"
                size="lg"
                onClick={removeExercise}
            >
                Remove exercise
            </Button>
          </Col>
        </Row>
      </Form>
    );
  } else if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    content = (
      <Alert variant="success">
        Exercise was succefully changed in the database.
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
