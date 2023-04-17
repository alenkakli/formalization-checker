import React, { useEffect } from 'react';
import { Spinner, Alert, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    fetchAllExercisesToUser,
    fetchUsersSolutions,
    selectStatus,
    selectExercises,
    selectError
} from '../../redux/progressPropositionsSlice';

function ExercisesToUser({ exercises, status, error, fetchAllExercisesToUser, fetchUsersSolutions }) {
    useEffect(() => {
        fetchAllExercisesToUser();
    }, [fetchAllExercisesToUser]);

    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        let exercises_list = []
        for(let i = 0; i < exercises.length; i++){
            let date = new Date(exercises[i].last_attempt_date).toLocaleString('sk-SK')
            if(exercises[i].last_attempt_correct){
                exercises_list.push(<tr key={exercises[i].user_name}>
                    <td>
                        <Link to={`/progress/${exercises[i].exercise_id}/${exercises[i].user_name}`}
                              key={exercises[i].title} onClick={() => fetchUsersSolutions( {exercise_id: exercises[i].exercise_id, user_name: exercises[i].user_name})}>
                            { exercises[i].title }
                        </Link>
                    </td>
                    <td>{exercises[i].solved} </td>
                    <td>{exercises[i].attempted} </td>
                    <td>{exercises[i].successful_attempts}</td>
                    <td>{exercises[i].attempts}</td>
                    <td>{date} &#x2713;</td>
                </tr>
                )
            }
            else{
                exercises_list.push(<tr key={exercises[i].user_name}>
                    <td>
                        <Link to={`/progress/${exercises[i].exercise_id}/${exercises[i].user_name}`}
                              key={exercises[i].title} onClick={() => fetchUsersSolutions( {exercise_id: exercises[i].exercise_id, user_name: exercises[i].user_name})}>
                            { exercises[i].title }
                        </Link>
                    </td>
                    <td>{exercises[i].solved} </td>
                    <td>{exercises[i].attempted} </td>
                    <td>{exercises[i].successful_attempts}</td>
                    <td>{exercises[i].attempts}</td>
                    <td>{date} &#x2715;</td>
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
                <th>Exercise</th>
                <th>Solved</th>
                <th>Attempted</th>
                <th>Successful</th>
                <th>Total</th>
                <th>Last attempt</th>
            </tr>
            </thead>
            <tbody>
            { exercises_list }
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
            <h2 className="mb-4">Your progress</h2>
            { content }
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

const mapDispatchToProps = { fetchAllExercisesToUser, fetchUsersSolutions };

export default connect(mapStateToProps, mapDispatchToProps)(ExercisesToUser);
