import React, { useEffect } from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {
    selectUsers,
    selectStatus,
    selectError, fetchUsersSolutions, selectProposition, fetchAllUsersToExercise, selectExerciseTitle
} from "../../redux/progressPropositionsSlice";


function UsersToExercise({ users, status, error, fetchAllUsersToExercise, fetchUsersSolutions, id, title })  {



  useEffect( () => {
    if (status === 'idle') {
        fetchAllUsersToExercise(id);
    }
  }, [status, id, users, fetchAllUsersToExercise]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    let user_list = users.map((x) => (
        <tr key={x.user_name}>
          <td>
            <Link to={`/progress/exercise/users/solutions`} key={x.user_name} onClick={() => fetchUsersSolutions( {exercise_id: x.exercise_id, user_name: x.user_name})}>
              { x.user_name }
            </Link>
          </td>
          <td>{x.solved}</td>
          <td>{x.attempts}</td>
        </tr>
    ));
    content =<Table striped bordered hover>
        <thead>
        <tr>
            <th>Student</th>
            <th>Solved</th>
            <th># Attempts</th>
        </tr>
        </thead>
        <tbody>
        { user_list }
        </tbody>
    </Table>

  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return (
      <div>
          <h2 className="mb-4"> {title} </h2>
          { content }
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
    users: selectUsers(state),
    proposition_id: selectProposition(state),
    status: selectStatus(state),
    error: selectError(state),
    title: selectExerciseTitle(state),
  };
};

const mapDispatchToProps = { fetchUsersSolutions, fetchAllUsersToExercise };

export default connect(mapStateToProps, mapDispatchToProps)(UsersToExercise);
