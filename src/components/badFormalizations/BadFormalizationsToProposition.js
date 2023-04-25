import React from 'react';
import {Spinner, Alert} from 'react-bootstrap';
import {
    useGetBadFormalizationsQuery
} from "../../redux/badFormalizationsSlice";
import {Cards} from "./Cards";

export const BadFormalizationsToProposition = ({ match }) => {
    const {exercise_id, proposition_id} = match.params
    const {
        data: proposition,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetBadFormalizationsQuery({exercise_id, proposition_id})

    let content
    let exerciseTitle
    let propositionTitle
    let formalization = null
    if (isFetching) {
        content = <Spinner animation="border" variant="primary" />;
    } else if (isSuccess) {
        exerciseTitle = proposition.title1;
        propositionTitle = proposition.title2;
        let formalizations = proposition.formalizations;
        let badFormalizations = proposition.bad_formalizations;

        formalization = formalizations.map((x) => (
            <h5 className="mb-1">{ x.formalization }</h5>
        ));

        content = badFormalizations.map((representative, i) => {
            return (
                <div className="m-2 mb-3">
                    <Cards key={i} i={i}
                           bad_formalization_id={representative.bad_formalization_id}
                           exercise_id={exercise_id}
                           students={representative.students}>
                    </Cards>
                </div>
            )
        });
    } else if (isError) {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return (
        <div>
            <h2 className="mb-3">{ exerciseTitle }</h2>
            <h3 className="mb-2">{ propositionTitle }</h3>
            <div className="mb-4">
                <p className="mb-0">correct formalization(s) </p>
                { formalization }
            </div>
            { content }
        </div>
    );
}
