import React, { useEffect } from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  selectStatus,
  selectError, fetchUsersSolutions, selectUsersSolution, selectExerciseTitle, selectUserName
} from "../../redux/progressPropositionsSlice";


function UsersSolutionList({ solutions, users, status, error, name, id, title })  {


  useEffect( () => {
    if (status === 'idle') {
      fetchUsersSolutions({exercise_id: id, user_name: name});
    }
  }, [status, id, users, fetchUsersSolutions]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {

    let s = [];
    let table = [];
    let proposition = null;
    let first= false
    for(let i = 0; i < solutions.length; i++){
      if(proposition !== solutions[i].proposition && first){
        proposition = solutions[i].proposition;
        s.push(<h5   key={proposition}> {proposition}</h5>)
        s.push(<Table striped bordered hover>
          <thead>
          <tr>
            <th>Date</th>
            <th>Solution</th>
            <th>Correct</th>
          </tr>
          </thead>
          <tbody>
          {table}
          </tbody>
        </Table>
          );
        table = [];
      }
      else if(proposition === null){
        proposition = solutions[i].proposition;
        first = true;
      }
      if(solutions[i].is_correct){
        table.push(
            <tr key={solutions[i].date}>
              <td>
                {solutions[i].date.split(".")[0].replace("T", " ") + " "}
              </td>
              <td>{solutions[i].solution}</td>
              <td>  &#x2713;</td>
            </tr>)
      }
      else{
        table.push(<tr key={solutions[i].date}>
              <td>
                {solutions[i].date.split(".")[0].replace("T", " ") + " "}
              </td>
              <td>{solutions[i].solution}</td>
              <td>  &#x2715;</td>
            </tr>)
      }
    }
    content = (
        <div key={s}>{ s }</div>
    );
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return (
      <div>
          <h2 className="mb-4">{title} by {name} </h2>
          { content }
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
    solutions: selectUsersSolution(state),
    status: selectStatus(state),
    error: selectError(state),
    name: selectUserName(state),
    title: selectExerciseTitle(state),
  };
};

const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(UsersSolutionList);
