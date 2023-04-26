import React, {useEffect, useState} from 'react';
import {Form,Spinner, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
    selectEvalStatus,
    selectEvalError,
    fetchActiveFeedbacks,
    feedbackRating, selectEvaluation, selectFeedbacks
} from '../../redux/solveExerciseSlice';
import {
    makeStructure
} from '../../redux/helpers';
import Feedback from "./Feedback";

function Evaluation({ proposition_id, evaluation, feedbacks, fetchFeedbacks, feedbackRating, status, error }) {
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        if (status === 'succeeded') {
            fetchFeedbacks({
                proposition_id,
                bad_formalization_id: evaluation.bad_formalization_id,
                active: true
            });
            setIndex(-1)
        }
    }, [status, fetchFeedbacks, proposition_id, evaluation]);

    if (status === 'loading') {
        return <Spinner animation="border" variant="primary" />;
    }
    if (status === 'succeeded') {
        return <>
            {viewEvalResult(evaluation)}
            {viewFeedbacks(proposition_id, evaluation, feedbacks, feedbackRating, index, setIndex)}
        </>
    }
    if (status === 'failed') {
        return (
            <ErrorEvalResult>
                { error }
            </ErrorEvalResult>
        );
    }
    return null;
}

const mapStateToProps = (state, ownProps) => {
    return {
        evaluation: selectEvaluation(state, ownProps.proposition_id),
        feedbacks: selectFeedbacks(state, ownProps.proposition_id),
        status: selectEvalStatus(state, ownProps.proposition_id),
        error: selectEvalError(state, ownProps.proposition_id)
    };
};

const mapDispatchToProps = {
    fetchFeedbacks: fetchActiveFeedbacks,
    feedbackRating
};

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);

const EvalResult = ({ type, children }) =>
    <Form.Text className={`text-${type}`} children={children} />

const CorrectEvalResult = () =>
    <EvalResult type="success">
        <strong>Your formalization is correct</strong>
    </EvalResult>

const ErrorEvalResult = ({children}) =>
    <EvalResult type="danger" className="text-warning">
        <strong>
            An error occured while validating your formalization:
        </strong>
        {children}
    </EvalResult>

const msgDiscuss = ' Discuss your formalization with your peers or teachers.'

const FailedEvalResult = () =>
    <EvalResult type="warning">
        <strong>
            We were unable to automatically validate your formalization.
        </strong>
        {msgDiscuss}
    </EvalResult>

const IncorrectEvalResult = ({ summary, children }) =>
    <EvalResult type="danger">
        <strong>Your formalization is incorrect.</strong>
        { !children
            ? <p>{summary}</p>
            : <details open>
                <summary className="mb-2">{summary}</summary>
                {children}
            </details>
        }
    </EvalResult>

const Interpretation = ({interpFunc, viewValue, subscript}) => {
    if (!interpFunc) return null;
    const entries = Object.entries(interpFunc);
    return (
        entries.length > 0 &&
        <ul className="list-unstyled mb-1">
            {entries.map(([symbol, value]) =>
                <li key={symbol}>
                    𝑖{subscript}({symbol}) = {viewValue(value)}
                </li>
            )}
        </ul>
    );
};

const viewSetValue = (tuples) => (
    `{${
        tuples.map((tuple) => tuple.length > 1
            ? `(${tuple})`
            : tuple
        ).join(', ')
    }}`
);

const Structure = ({ subscript, D, iC, iP, iF }) => (<>
    <p className="mb-1">
        𝐷{subscript}{` = {${D.join(", ")}}`}
    </p>
    <Interpretation
        interpFunc={iC}
        viewValue={(value) => value}
        subscript={subscript}
    />
    <Interpretation
        interpFunc={iP}
        viewValue={viewSetValue}
        subscript={subscript}
    />
    <Interpretation
        interpFunc={iF}
        viewValue={viewSetValue}
        subscript={subscript}
    />
</>)

const Counterexample = ({structure, description, index, msgNotFound}) => {
    const subscript = index ? <sub>{index}</sub> : null;
    return (
        structure
        ? <div className="mb-2">
            <p className="mb-1">
                {description}{" "}
                ℳ{subscript} = (𝐷{subscript}, 𝑖{subscript}) where:
            </p>
            <Structure subscript={subscript} {...structure}/>
        </div>
        : <p className="mb-2">
            { msgNotFound ??
                'We could not find a counterexample automatically.'
            }
            {msgDiscuss}
        </p>
    );
}

const viewEvalResult = (evaluation) => {
    if (evaluation.solutionToFormalization === 'OK'
        && evaluation.formalizationToSolution === 'OK') {
        return <CorrectEvalResult />;
    }

    if (evaluation.solutionToFormalization === 'TE'
        || evaluation.formalizationToSolution === 'TE'
        || evaluation.solutionToFormalization === 'ME'
        || evaluation.formalizationToSolution === 'ME') {
        return <FailedEvalResult />;
    }

    // FIXME: evaluation.languageConstants is sometimes empty
    // Example: Charles hates no one whom Agatha hates.
    // \a x(-hates(C,x) \limpl -hates(C,x))
    // FIXME: 1.5.1. Peter je muž. A = E.
    // No counterexample in one direction, in the other direction:
    // got i(muz) = {}; should get: i(muz) = {i(Peter)}
    const C_L = new Set(evaluation.languageContants);
    // TODO: Fix backend to return a pair of objects similar to these
    const correctImpliesInput = {
        result: evaluation.formalizationToSolution,
        description: evaluation.m1,
        counterexample: makeStructure(
            evaluation.domainFormalizationToSolution,
            evaluation.symbolsFormalizationToSolution,
            C_L
        )
    }
    const inputImpliesCorrect = {
        result: evaluation.solutionToFormalization,
        description: evaluation.m2,
        counterexample: makeStructure(
            evaluation.domainSolutionToFormalization,
            evaluation.symbolsSolutionToFormalization,
            C_L
        )
    }

    if (inputImpliesCorrect.result === 'OK'
        && correctImpliesInput.result === 'WA') {
        return (
            <IncorrectEvalResult summary={
                `Your formalization is false
                in some first-order structure
                where the correct formalization is true.`
            }>
                <Counterexample
                    description="One such structure is"
                    structure={correctImpliesInput.counterexample}
                />
            </IncorrectEvalResult>
        );
    }

    if (inputImpliesCorrect.result === 'WA'
        && correctImpliesInput.result === 'OK') {
        return (
            <IncorrectEvalResult summary={
                `Your formalization is true
                in some first-order structure
                where the correct formalization is false.`
            }>
                <Counterexample
                    description="One such structure is"
                    structure={inputImpliesCorrect.counterexample}
                />
            </IncorrectEvalResult>
        );
    }

    return (
        <IncorrectEvalResult
            summary={`Your formalization is false
                in some first-order structure
                where the correct formalization is true,
                and vice versa.`}
        >
            <Counterexample
                description="Your formalization is true
                    and the correct formalization is false,
                    e.g., in structure"
                structure={inputImpliesCorrect.counterexample}
                index={1}
                msgNotFound={`We could not automatically find a structure
                    in which your formalization is true
                    and the correct formalization is false.`}
            />
            <Counterexample
                description="Your formalization is false
                    and the correct formalization is true,
                    e.g., in structure"
                structure={correctImpliesInput.counterexample}
                index={2}
                msgNotFound={`We could not automatically find a structure
                    in which your formalization is false
                    and the correct formalization is true.`}
            />
        </IncorrectEvalResult>
    );
}

const viewFeedbacks = (proposition_id, evaluation, feedbacks, feedbackRating, index, setIndex) => {
    if (!(feedbacks && feedbacks.length > 0)) {
        return null;
    }

    const visibleFeedbacks = index >= 0 &&
        feedbacks.slice(0, index+1).map(
            (feedback) => <Feedback key={feedback.feedback_id} feedback={feedback}/>
        );

    const hintButton = index < feedbacks.length-1 &&
        <Button
            className="mt-1 mr-1 mb-1"
            onClick={ () => {
                setIndex(++index);
                feedbackRating({
                    proposition_id,
                    index,
                    feedback_id: feedbacks[index].feedback_id,
                    solution_id: evaluation.solution_id
                });
            }}
        >
            {index < 0 ? 'Hint' : 'Next hint'}
        </Button>;

    return <>
        {visibleFeedbacks}
        {hintButton}
    </>;
}
