import React from 'react';
import {Card, Spinner} from 'react-bootstrap';
import {Feedbacks} from "./Feedbacks";
import {useGetBadFormalizationInfoQuery} from "../../redux/badFormalizationsSlice";
import QueryError from '../common/QueryError';
import { HashLink as Link } from 'react-router-hash-link';


export const Cards = ({ i, bad_formalization_id, exercise_id, students }) => {
    const {
        data: bad_formalization,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetBadFormalizationInfoQuery({exercise_id, bad_formalization_id})

    let content

    if (isFetching) {
        content = <Spinner animation="border" variant="primary" />;
    } else if (isSuccess) {
        let formalizations;
        let students_list = students.map((s) => (
            <Link to={`/progress/${exercise_id}/${s.user_name}#${s.solution_id}`} key={s.user_name}
                  className="my-0 pl-4 text-muted d-block">
                {s.user_name}
            </Link>
            )
        );
        if (bad_formalization.bad_solutions !== null) {
            let badSolutions = bad_formalization.bad_solutions.map((f) => (
                <Card.Text className="my-1 pl-4 text-muted" >
                    {f.solution}
                </Card.Text>
            ));
            formalizations = (
                <details>
                    <summary className="mt-2">{bad_formalization.bad_solutions.length} equivalent
                        bad formalization(s)</summary>
                    { badSolutions }
                </details>
            )
        }

        content = (
            <div>
                <Card.Body className="pt-4 pb-0 px-4">
                    <h5 className="card-title">{bad_formalization.bad_formalization}</h5>
                    <details>
                        <summary className="mt-2">students: {students.length}</summary>
                        { students_list }
                    </details>
                    { formalizations }
                </Card.Body>
                <Feedbacks key={i} i={i} bad_formalization_id={bad_formalization_id}/>
            </div>
        )

    } else if (isError) {
        content = (
            <QueryError error={error} />
        );
    }

    return (
        <Card>
            { content }
        </Card>
    );

}
