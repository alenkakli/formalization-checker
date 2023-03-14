import React, { useEffect } from 'react';
import {Spinner, Alert, Table, Card, Form, Button, ListGroup} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    fetchBadFormalizationsToProposition,
    selectBadFormalizations,
    selectStatus,
    selectError,
    selectExerciseTitle,
    selectPropositionTitle,
    selectPropositionFormalization,
    updateFeedbackText
} from '../../redux/exercisesSlice';
import AddFeedback from "./AddFeedback";
import Feedbacks from "./Feedbacks";

function BadFormalizationsToPropositions({ badFormalizations, formalizations, exerciseTitle, propositionTitle,
                                             status, error, fetchBadFormalizationsToProposition,
                                             match: { params: { exercise_id, proposition_id } } }) {

    useEffect(() => {
        fetchBadFormalizationsToProposition({exercise_id, proposition_id});
    }, [fetchBadFormalizationsToProposition]);

    let content = null;
    let formalization = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        formalization = formalizations.map((x) => (
            <h5 className="mb-1">{ x.formalization }</h5>
        ));

        content = badFormalizations.map((representative, i) => {
            console.log(representative);

            let summary = null;

            if (representative.bad_solutions !== null) {
                let badSolutions = representative.bad_solutions.map((f) => (
                    <Card.Text className="my-1 pl-4 text-muted" >
                        {f.solution}
                    </Card.Text>
                ));

                summary = (
                    <details>
                        <summary className="mt-2">{representative.bad_solutions.length} equivalent
                            bad formalization(s)</summary>
                        { badSolutions }
                    </details>
                )
            }

            return (
                <div className="m-2 mb-3">
                <h6 className="mb-0">students that made this mistake: {representative.students}</h6>
                <Card>
                    <Card.Body className="pt-4 pb-0 px-4">
                        <Card.Title>{representative.bad_formalization}</Card.Title>
                        { summary }

                        {/*<Card.Text>*/}
                        {/*    <h5 className="mt-2">Feedback</h5>*/}
                        {/*    <ListGroup as="ol">*/}
                        {/*        { feedbacks }*/}
                        {/*    </ListGroup>*/}
                        {/*    <Feedback key = {i} i={i} representative={representative} />*/}
                        {/*</Card.Text>*/}
                    </Card.Body>
                    {/* todo vybrat ktory variant zobrazovania feedbackov je lepsi ci ^ alebo v */}
                    <Feedbacks key={i} i={i} len={badFormalizations.length}
                               bad_formalization_id = {representative.bad_formalization_id}
                               representative={representative}/>
                </Card>
                </div>
            )
        });
    } else if (status === 'failed') {
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
                { formalization }
            </div>
            { content }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        badFormalizations: selectBadFormalizations(state),
        status: selectStatus(state),
        error: selectError(state),
        exerciseTitle: selectExerciseTitle(state),
        propositionTitle: selectPropositionTitle(state),
        formalizations: selectPropositionFormalization(state)
    };
};

const mapDispatchToProps = { fetchBadFormalizationsToProposition, updateFeedbackText  };
export default connect(mapStateToProps, mapDispatchToProps)(BadFormalizationsToPropositions);
