import React from 'react';
import {Spinner, Alert, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useGetExercisesQuery} from "../../redux/apiSlice";

export const Exercises = () => {
    const {
        data: exercises,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExercisesQuery()

    let content = null;
    if (isLoading) {
        content = <Spinner animation="border" variant="primary"/>;
    } else if (isSuccess) {
        let exercises_list = exercises.map((exercise) => (
            <tr key={exercise.exercise_id}>
                <td>
                    <Link to={`/progress/${exercise.exercise_id}`} key={exercise.exercise_id}>
                        {exercise.title}
                    </Link>
                </td>
                <td>{exercise.attempted}</td>
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
            <h2 className="mb-4">Student progress</h2>
            {content}
        </div>
    );

}
