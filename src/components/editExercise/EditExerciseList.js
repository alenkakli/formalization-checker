import React from 'react';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchSavedExercise
} from '../../redux/addExerciseSlice';
import {useGetExercisesQuery} from "../../redux/badFormalizationsSlice";


function EditExerciseList({ fetchSavedExercise }) {
  const {
    data: exercises,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetExercisesQuery(undefined, {refetchOnMountOrArgChange: true})

  let content = null;
  if (isLoading) {
    content = <Spinner animation="border" variant="primary" />;
  } else if (isSuccess) {
    let exercises_list = exercises.map((x) => (
      <ListGroup.Item
        as={Link} to={`/edit/${x.exercise_id}`} key={x.exercise_id}
        action
        onClick={() => fetchSavedExercise(x.exercise_id)}
      >
        { x.title }
      </ListGroup.Item>
    ));
    content = <ListGroup>{ exercises_list }</ListGroup>;
  } else if (isError) {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Edit exercises</h1>
      { content }
    </div>
  );
}

const mapDispatchToProps = { fetchSavedExercise };

export default connect(null, mapDispatchToProps)(EditExerciseList);
