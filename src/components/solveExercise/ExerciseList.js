import React from 'react';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchExercise
} from '../../redux/solveExerciseSlice';
import {selectUser} from "../../redux/userSlice";
import {useGetExercisesQuery} from "../../redux/badFormalizationsSlice";


function ExerciseList({ fetchExercise, username }) {
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
        as={Link} to={`/solve/${x.exercise_id}`} key={x.exercise_id}
        variant="primary" action
        onClick={() => fetchExercise({exercise_id:x.exercise_id, user_name: username })}
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
      <h2 className="mb-4">Exercises</h2>
      { content }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    username: selectUser(state)
  };
};

const mapDispatchToProps = { fetchExercise };

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);
