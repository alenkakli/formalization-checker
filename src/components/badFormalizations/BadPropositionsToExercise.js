import React, { useEffect } from 'react';
import { Spinner, Alert, Table, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    fetchBadPropositionsToExercise,
    selectStatus,
    selectError,
    selectExerciseTitle,
    selectBadPropositions
} from '../../redux/exercisesSlice';
import {Link} from "react-router-dom";

function BadPropositionsToExercise({ badPropositions, status, error, exerciseTitle, match: { params: { exercise_id } }, fetchBadPropositionsToExercise }) {
    useEffect(() => {
        fetchBadPropositionsToExercise(exercise_id);
    }, [fetchBadPropositionsToExercise]);

    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        let exercises_list = badPropositions.map((proposition) => {
            console.log(proposition);
            return (
                <tr key={proposition.proposition}>
                    <td>
                        <Link to={`/bad_formalizations/${exercise_id}/${proposition.proposition_id}`} key={proposition.proposition_id}>
                            { proposition.proposition }
                        </Link>
                    </td>
                    <td>{ proposition.bad_formalizations }</td>
                    <td>{ proposition.students }</td>
                    {/*<td>{ proposition.solutions }</td>*/}
                </tr>);
        });
        content =
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Proposition</th>
                    <th>Bad formalizations</th>
                    <th>Students</th>
                    {/*<th>Solutions</th>*/}
                </tr>
                </thead>
                <tbody>
                { exercises_list }
                </tbody>
            </Table>;

    } else if (status === 'failed') {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return (
        <div>
            <h2 className="mb-4">{ exerciseTitle }</h2>
            {content}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        badPropositions: selectBadPropositions(state),
        status: selectStatus(state),
        error: selectError(state),
        exerciseTitle: selectExerciseTitle(state)
    };
};

const mapDispatchToProps = { fetchBadPropositionsToExercise };
export default connect(mapStateToProps, mapDispatchToProps)(BadPropositionsToExercise);
