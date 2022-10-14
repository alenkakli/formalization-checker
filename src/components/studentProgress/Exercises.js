import React, { useEffect } from 'react';
import { Spinner, Alert, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchAllExercises,
  selectExercises,
  selectStatus,
  selectError
} from '../../redux/exercisesSlice';
import {fetchAllUsersToExercise} from "../../redux/progressPropositionsSlice";


function Exercises({ exercises, status, error, fetchAllExercises, fetchAllUsersToExercise }) {
  useEffect(() => {
    if (status === 'idle') {
      fetchAllExercises();
    }
  }, [status, fetchAllExercises]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    let exercises_list = exercises.map((x) => (
      <tr key={x.exercise_id}>
        <td>
          <Link to={`/progress/exercise/users`} key={x.exercise_id} onClick={() => fetchAllUsersToExercise(x.exercise_id)}>
            { x.title }
          </Link>
        </td>
        <td>{x.attempted}</td>
    </tr>
    ));
  content =
   <Table striped bordered hover>
      <thead>
      <tr>
        <th>Exercise</th>
        <th>Students attempted</th>
      </tr>
      </thead>
     <tbody>
      { exercises_list }
     </tbody>
  </Table>
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Student progress</h2>

            {content}

    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    exercises: selectExercises(state),
    status: selectStatus(state),
    error: selectError(state),
  };
};

const mapDispatchToProps = { fetchAllExercises, fetchAllUsersToExercise };

export default connect(mapStateToProps, mapDispatchToProps)(Exercises);
