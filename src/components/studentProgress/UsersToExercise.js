import React, { useEffect } from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import {PersonFillGear, Check, X} from "react-bootstrap-icons";
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {
    selectUsers,
    selectStatus,
    selectError,
    selectExerciseTitle,
    fetchAllUsersToExercise
} from "../../redux/progressPropositionsSlice";


function UsersToExercise({ users, status, error, title, match: { params: { exercise_id } }, fetchAllUsersToExercise })  {
  useEffect( () => {
        fetchAllUsersToExercise(exercise_id);
  }, [exercise_id, fetchAllUsersToExercise]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
      let user_list = []
      for(let i = 0; i < users.length; i++){
          let date = new Date(users[i].last_attempt_date).toLocaleString('sk-SK')
          user_list.push(<tr key={users[i].user_name}>
                  <td>
                      <Link to={`/progress/${users[i].exercise_id}/${users[i].user_name}`} key={users[i].user_name}>
                          { users[i].user_name + ' '}
                      </Link>
                      {(users[i].is_admin) ? <PersonFillGear size={20}/> : ''}
                  </td>
                  <td>{users[i].solved} </td>
                  <td>{users[i].attempted} </td>
                  <td>{users[i].successful_attempts}</td>
                  <td>{users[i].attempts}</td>
                  <td>
                      {date + ' '}
                      {(users[i].last_attempt_correct) ? <Check size={25} color="green"/> : <X size={25} color="red"/>}
                  </td>
              </tr>
          )
      }

    content =<Table striped bordered hover>
        <thead>
        <tr>
            <th> </th>
            <th colSpan={2}>Propositions </th>
            <th colSpan={2}>Attempt</th>
            <th> </th>
        </tr>
        <tr>
            <th>Student</th>
            <th>Solved</th>
            <th>Attempted</th>
            <th>Successful</th>
            <th>Total</th>
            <th>Last attempt</th>
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
    status: selectStatus(state),
    error: selectError(state),
    title: selectExerciseTitle(state),
  };
};

const mapDispatchToProps = { fetchAllUsersToExercise };

export default connect(mapStateToProps, mapDispatchToProps)(UsersToExercise);
