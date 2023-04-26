import React from 'react';
import {Spinner, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useGetExercisesQuery} from "../../redux/badFormalizationsSlice";
import QueryError from '../common/QueryError';

export const Exercises = () => {
    const {
        data: exercises,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExercisesQuery(undefined, {refetchOnMountOrArgChange: true})

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
        content = <QueryError error={error} />;
    }

    return (
        <div>
            <h2 className="mb-4">Student progress</h2>
            {content}
        </div>
    );

}
