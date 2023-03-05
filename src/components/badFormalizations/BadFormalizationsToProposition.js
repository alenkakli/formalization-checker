import React, { useEffect } from 'react';
import { Spinner, Alert, Table, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    fetchBadFormalizationsToProposition,
    selectBadFormalizations,
    selectStatus,
    selectError,
    selectExerciseTitle,
    selectPropositionTitle,
} from '../../redux/exercisesSlice';

function BadFormalizationsToPropositions({ badFormalizations, status, error, exerciseTitle, propositionTitle, match: { params: { exercise_id, proposition_id } }, fetchBadFormalizationsToProposition }) {
    useEffect(() => {
        console.log("BadFormalizationsToPropositions")
        fetchBadFormalizationsToProposition({exercise_id, proposition_id});
    }, [fetchBadFormalizationsToProposition]);

    let content = null;
    console.log("badFormalizations");
    console.log(badFormalizations)
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        content = badFormalizations.map((representative) => {
                let all = representative.all_formalizations.map((a) => (
                    <Card.Subtitle className="mb-2 text-muted" style={{ paddingLeft: '2em', paddingTop: '1ex' }}>
                        {a.solution}
                    </Card.Subtitle>
            ));

            return (
                <Card style={{ margin: '1em', padding: '1ex'}}>
                    <Card.Body>
                        <Card.Title>{representative.bad_formalization}</Card.Title>
                        <details>
                            <summary className="mt-4">{representative.all_formalizations.length} equivalent bad formalization(s)</summary>
                            {all}
                        </details>
                        <Card.Text>
                            feedback
                        </Card.Text>
                    </Card.Body>
                </Card>
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
            <h2 className="mb-4">{exerciseTitle}</h2>
            <h3 className="mb-4">{propositionTitle}</h3>
            {content}
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
    };
};

const mapDispatchToProps = { fetchBadFormalizationsToProposition };
export default connect(mapStateToProps, mapDispatchToProps)(BadFormalizationsToPropositions);
