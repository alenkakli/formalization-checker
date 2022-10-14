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
      let user_list = []
      for(let i = 0; i < users.length; i++){
          console.log(users[i])
          if(users[i].lastattemptcorrec){
              user_list.push(<tr key={users[i].user_name}>
                  <td>
                      <Link to={`/progress/exercise/users/solutions`} key={users[i].user_name} onClick={() => fetchUsersSolutions( {exercise_id: users[i].exercise_id, user_name: users[i].user_name})}>
                          { users[i].user_name }
                      </Link>
                  </td>
                  <td>{users[i].solved} </td>
                  <td>{users[i].attempted} </td>
                  <td>{users[i].successful_attempts}</td>
                  <td>users[i].attempts}</td>
                  <td>users[i].huuu}</td>
                  <td>{users[i].last_attempt_date.split(".")[0].replace("T", " ") + " "} &#x2713;</td>
                  </tr>
                  )
          }
          else{
              user_list.push(<tr key={users[i].user_name}>
                      <td>
                          <Link to={`/progress/exercise/users/solutions`} key={users[i].user_name} onClick={() => fetchUsersSolutions( {exercise_id: users[i].exercise_id, user_name: users[i].user_name})}>
                              { users[i].user_name }
                          </Link>
                      </td>
                      <td>{users[i].solved} </td>
                      <td>{users[i].attempted} </td>
                      <td>{users[i].successful_attempts}</td>
                      <td>{users[i].attempts}</td>
                      <td>{users[i].last_attempt_date.split(".")[0].replace("T", " ") + " "} &#x2715;</td>
                  </tr>
              )
          }


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

const mapDispatchToProps = { fetchUsersSolutions, fetchAllUsersToExercise };

export default connect(mapStateToProps, mapDispatchToProps)(UsersToExercise);
