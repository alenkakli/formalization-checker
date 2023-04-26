import React from 'react';
import {Alert, Card, Spinner} from 'react-bootstrap';
import {Feedbacks} from "./Feedbacks";
import {useGetBadFormalizationInfoQuery} from "../../redux/badFormalizationsSlice";

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
            <a className="my-0 pl-4 text-muted d-block" href={`/progress/${exercise_id}/${s.user_name}`}>{s.user_name}</a>
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
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return (
        <Card>
            { content }
        </Card>
    );

}
