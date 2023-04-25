import React, {useEffect, useState} from 'react';
import {Spinner, Alert, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
    selectEvalStatus,
    selectEvalError,
    fetchActiveFeedbacks,
    feedbackRating, selectEvaluation, selectFeedbacks
} from '../../redux/solveExerciseSlice';
import {
    getStringDomainAndPredicates,
} from '../../redux/helpers';
import Feedback from "./Feedback";

function Evaluation({ proposition_id, evaluation, feedbacks, fetchFeedbacks, feedbackRating, status, error }) {
    useEffect(() => {
        if (status === 'succeeded') {
            fetchFeedbacks({
                proposition_id: proposition_id,
                bad_formalization_id: evaluation.bad_formalization_id,
                active: true
            });
            setIndex(-1)
            setButtonTitle('Hint')
        }
    }, [status]);

    let content = null;
    const [index, setIndex] = useState()
    const [buttonTitle, setButtonTitle] = useState()

    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        content = getMessage(proposition_id, evaluation, feedbacks, feedbackRating, index, setIndex, buttonTitle, setButtonTitle);
    } else if (status === 'failed') {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return content;
}

const mapStateToProps = (state, ownProps) => {
    return {
        evaluation: selectEvaluation(state, ownProps.proposition_id),
        feedbacks: selectFeedbacks(state, ownProps.proposition_id),
        status: selectEvalStatus(state, ownProps.proposition_id),
        error: selectEvalError(state, ownProps.proposition_id)
    };
};

const mapDispatchToProps = { fetchFeedbacks: fetchActiveFeedbacks, feedbackRating };

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);


const getMessage = (proposition_id, evaluation, feedbacks, feedbackRating, index, setIndex, buttonTitle, setButtonTitle) => {

    if (evaluation.solutionToFormalization === 'OK'
        && evaluation.formalizationToSolution === 'OK') {
        return (
            <Alert variant="success">
                <b>Riešenie je správne.</b>
            </Alert>
        );
    } else if (evaluation.solutionToFormalization === 'TE'
        || evaluation.formalizationToSolution === 'TE' || evaluation.solutionToFormalization === 'ME'
        || evaluation.formalizationToSolution === 'ME') {
        return (
            <Alert variant="warning">
                <p> Dokazovaču sa nepodarilo zistiť,
                    či je vaše riešenie správne alebo nesprávne.
                    Na správnosť vášho riešenia sa spýtajte.</p>
            </Alert>
        );
    } else {
        let pom = getStringDomainAndPredicates(evaluation.symbolsFormalizationToSolution, evaluation.domainFormalizationToSolution,
            evaluation.languageContants);
        let domainFormToSol = pom[0];
        let symbolsFormToSol = pom[1];

        pom = getStringDomainAndPredicates(evaluation.symbolsSolutionToFormalization, evaluation.domainSolutionToFormalization,
            evaluation.languageContants);
        let domainSolToForm = pom[0];
        let symbolsSolToForm = pom[1];

        let message;

        const hintButton = feedbacks && feedbacks.length > 0 && index < feedbacks.length-1 ? (
            <Button
                className="mt-1 mr-1 mb-1"
                variant="primary"
                onClick={ () => {
                    setIndex(++index)
                    setButtonTitle('Next Hint')
                     feedbackRating({
                        proposition_id: proposition_id,
                        index: index,
                        feedback_id: feedbacks[index].feedback_id,
                        solution_id: evaluation.solution_id
                    });
                }}
            >
                {buttonTitle}
            </Button>
        ) : null

        const feedbacks_list = index >= 0 ? feedbacks.slice(0, index+1).map( (feedback) => (
                <Feedback feedback={feedback}/>
            )
        ) : null


        if (evaluation.solutionToFormalization === 'OK'
            && evaluation.formalizationToSolution === 'WA') {
            if (evaluation.iFormalizationSolution !== 'null') {
                message = (
                    <details>
                        <summary><b>Riešenie je nesprávne.</b>
                            <p>Vieme nájsť konkrétnu štruktúru,
                                v ktorej je hľadaná správna formalizácia pravdivá,
                                ale vaša formalizácia je nepravdivá.</p></summary>

                        <p>{evaluation.m1}</p>
                        <p>{domainFormToSol}</p>
                        {symbolsFormToSol.split("\n").map((i,key) => {
                            return <div className="p" key={key}>{i}</div>;
                        })}
                        <br/>
                    </details>
                )
            } else {
                message = (
                    <details>
                        <summary><b>Riešenie je nesprávne.</b>
                            <p>Nepodarilo sa nájsť štruktúru, na vaše riešenie sa radšej opýtajte.</p></summary>

                    </details>
                )
            }
        } else if (evaluation.solutionToFormalization === 'WA'
            && evaluation.formalizationToSolution === 'OK') {
            if (evaluation.iSolutionToFormalization !== 'null') {
                message = (
                    <details>
                        <summary> <b>Riešenie je nesprávne.</b>
                            <p>Vieme nájsť konkrétnu štruktúru,
                                v ktorej je vaša formalizácia pravdivá,
                                ale hľadaná správna formalizácia je nepravdivá.</p> </summary>
                        <p>{evaluation.m2}</p>
                        <p>{domainSolToForm}</p>
                        {symbolsSolToForm.split("\n").map((i,key) => {
                            return <div className="p" key={key}>{i}</div>;
                        })}
                    </details>
                )
            } else {
                message = (
                    <details>
                        <summary><b>Riešenie je nesprávne.</b>
                            <p>Nepodarilo sa nájsť štruktúru, na vaše riešenie sa radšej opýtajte.</p></summary>
                    </details>
                )
            }
        } else {
            message = (
                <details>
                    <summary><b>Riešenie je nesprávne.</b>
                        <p>Vieme nájsť konkrétne štruktúry,
                            v ktorých je vaša formalizácia pravdivá,
                            ale hľadaná správna formalizácia je nepravdivá, a naopak.</p></summary>

                    <p>{evaluation.m2}</p>
                    <p>{domainSolToForm}</p>
                    {symbolsSolToForm.split("\n").map((i,key) => {
                        return <div className="p" key={key}>{i}</div>;
                    })}


                    <p>{evaluation.m1}</p>
                    <p>{domainFormToSol}</p>
                    {symbolsFormToSol.split("\n").map((i,key) => {
                        return <div className="p" key={key}>{i}</div>;
                    })}
                </details>
            )
        }

        return (
            <div>
                <Alert variant="danger">
                    { message }
                </Alert>
                <div className="mb-1">
                    {feedbacks_list}
                </div>
                {hintButton}
            </div>
        )

    }
};
