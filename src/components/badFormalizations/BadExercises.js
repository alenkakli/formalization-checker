import React, { useEffect } from 'react';
import { Spinner, Alert, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    fetchBadExercises,
    selectExercises,
    selectStatus,
    selectError,
} from '../../redux/exercisesSlice';

function BadExercises({ badExercises, status, error, fetchBadExercises }) {
    useEffect(() => {
        fetchBadExercises();
    }, [fetchBadExercises]);

    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        let exercises_list = badExercises.map((exercise) => (
            <tr key={exercise.exercise_id}>
                <td>
                    <Link to={`/bad_formalizations/${exercise.exercise_id}`} key={exercise.exercise_id} >
                        { exercise.title }
                    </Link>
                </td>
                <td>{exercise.bad_formalizations}</td>
                <td>{exercise.students}</td>
                {/*<td>{exercise.solutions}</td>*/}
            </tr>
        ));
        content =
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Exercise</th>
                    <th>Bad formalizations</th>
                    <th>Students</th>
                    {/*<th>Solutions</th>*/}
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
            <h2 className="mb-4">Bad formalizations</h2>
            {content}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        badExercises: selectExercises(state),
        status: selectStatus(state),
        error: selectError(state),
    };
};

const mapDispatchToProps = { fetchBadExercises };
export default connect(mapStateToProps, mapDispatchToProps)(BadExercises);
