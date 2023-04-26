import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import {Link} from "react-router-dom";
import {useGetBadPropositionsQuery} from "../../redux/badFormalizationsSlice";
import QueryError from '../common/QueryError';

export const BadPropositionsToExercise = ({ match }) => {
    const {exercise_id} = match.params
    const {
        data: exercise,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetBadPropositionsQuery(exercise_id)

    let content
    let badPropositions;
    let title;

    if (isFetching) {
        content = <Spinner animation="border" variant="primary" />;
    } else if (isSuccess) {
        badPropositions = exercise.propositions;
        title = exercise.title1;

        let propositions_list = badPropositions.map((proposition) => {
            return (
                <tr key={proposition.proposition}>
                    <td>
                        <Link to={`/bad_formalizations/${exercise_id}/${proposition.proposition_id}`} key={proposition.proposition_id}>
                            { proposition.proposition }
                        </Link>
                    </td>
                    <td>{ proposition.bad_formalizations }</td>
                    <td>{ proposition.students }</td>
                </tr>);
        });
        content =
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Proposition</th>
                    <th>Bad formalizations</th>
                    <th>Students</th>
                </tr>
                </thead>
                <tbody>
                { propositions_list }
                </tbody>
            </Table>;
    } else if (isError) {
        content = <QueryError error={error} />;
    }

    return (
        <div>
            <h2 className="mb-4">{ title }</h2>
            {content}
        </div>
    );
}
