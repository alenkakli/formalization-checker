import React from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useGetBadExercisesQuery} from "../../redux/apiSlice";

export const BadExercises = () => {
    const {
        data: badExercises,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBadExercisesQuery()

    let content

    if (isLoading) {
        content = <Spinner animation="border" variant="primary"/>;
    } else if (isSuccess) {

        let exercises_list = badExercises.map((exercise) => (
            <tr key={exercise.exercise_id}>
                <td>
                    <Link to={`/bad_formalizations/${exercise.exercise_id}`} key={exercise.exercise_id}>
                        {exercise.title}
                    </Link>
                </td>
                <td>{exercise.bad_formalizations}</td>
                <td>{exercise.students}</td>
            </tr>
        ));
        content =
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Exercise</th>
                    <th>Bad formalizations</th>
                    <th>Students</th>
                </tr>
                </thead>
                <tbody>
                {exercises_list}
                </tbody>
            </Table>
    } else if (isError) {
        content = (
            <Alert variant="danger">
                {error}
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
