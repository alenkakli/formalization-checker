import React, { useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import Solution from './Solution';
import {
  selectExercise,
  selectStatus,
  selectError,
  fetchExercise
} from '../../redux/solveExerciseSlice';
import { useParams } from 'react-router';


function SolveExercise({ match, exercise, status, error, fetchExercise, user })  {

  let { id } = useParams();

  useEffect(() => {
    if (status === 'idle') {
      fetchExercise(id);
    }
  }, [status, id, exercise, fetchExercise]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    const propositions_list = exercise.propositions.map((x) => (
      <Solution
        key={x.proposition_id}
        exercise_id={id}
        proposition_id={x.proposition_id}
        proposition={x.proposition}
        user={user}
      />
    ));
    content = (
      <div>
        <h2>{ exercise.title }</h2>
        <h5 className="mt-4">Constants</h5>
        <p>{ exercise.constants }</p>
        <h5 className="mt-4">Predicates</h5>
        <p>{ exercise.predicates }</p>
        <h5 className="mt-4">Functions</h5>
        <p>{ exercise.functions }</p>
        <h5 className="mt-4">Description</h5>
        <p>{ exercise.description }</p>
        { propositions_list }
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return content;
}

const mapStateToProps = (state) => {
  return {
    exercise: selectExercise(state),
    status: selectStatus(state),
    error: selectError(state),
    user: state.user.user.username,
  };
};

const mapDispatchToProps = { fetchExercise };

export default connect(mapStateToProps, mapDispatchToProps)(SolveExercise);
