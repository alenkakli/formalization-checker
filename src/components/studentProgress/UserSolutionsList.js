import React, { useEffect } from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
  selectStatus,
  selectError, fetchUsersSolutions, selectUsersSolution, selectExerciseTitle, selectUserName
} from "../../redux/progressPropositionsSlice";


function UsersSolutionList({ solutions, status, error, title, match: { params: { exercise_id, user_name } }, fetchUsersSolutions })  {
  useEffect( () => {
      fetchUsersSolutions({exercise_id, user_name});
  }, [exercise_id, user_name]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;

  } else if (status === 'succeeded') {
    let s = [];
    let table = [];
    let proposition = null;
    let first= false;
    for(let i = 0; i < solutions.length; i++){
      let date = new Date(solutions[i].date).toLocaleString('sk-SK')

      if(proposition === null){
        proposition = solutions[i].proposition;
        first = true;
      }
      else if(proposition !== solutions[i].proposition && first){
        s.push(<h5   key={proposition} > {proposition}</h5>)
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
        proposition = solutions[i].proposition;
      }
      if(solutions[i].is_correct){
        table.push(
            <tr key={solutions[i].date}>
              <td>
                {date}
              </td>
              <td>{solutions[i].solution}</td>
              <td>  &#x2713;</td>
            </tr>)
      }
      else{
        table.push(<tr key={solutions[i].date}>
              <td>
                {date}
              </td>
              <td>{solutions[i].solution}</td>
              <td>  &#x2715;</td>
            </tr>)
      }
    }

    //last element of array
    s.push(<h5 key={proposition}> {proposition}</h5>)
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

    content = (
        <div key={s}>{ s }</div>
    );
  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return (
      <div>
          <h2 className="mb-4" style={{display: "inline-block"}}>{title}</h2>
          <h4 className="mb-4" style={{display: "inline-block", padding: "0ex 1ex"}}>by</h4>
          <h2 className="mb-4" style={{display: "inline-block"}}>{user_name}</h2>
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

const mapDispatchToProps = { fetchUsersSolutions };

export default connect(mapStateToProps, mapDispatchToProps)(UsersSolutionList);
