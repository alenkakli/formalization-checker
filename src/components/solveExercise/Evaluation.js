import React from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  selectEvaluation,
  selectEvalStatus,
  selectEvalError
} from '../../redux/solveExerciseSlice';
import {
    makeStructure
} from '../../redux/helpers';


function Evaluation({ evaluation, status, error }) {
  if (status === 'loading') {
    return <Spinner animation="border" variant="primary" />;
  }
  if (status === 'succeeded') {
    return getMessage(evaluation);
  }
  if (status === 'failed') {
    return (
      <ErrorFeedback>
        { error }
      </ErrorFeedback>
    );
  }
  return null;
}

const mapStateToProps = (state, ownProps) => {
  return {
    evaluation: selectEvaluation(state, ownProps.proposition_id),
    status: selectEvalStatus(state, ownProps.proposition_id),
    error: selectEvalError(state, ownProps.proposition_id)
  };
};

export default connect(mapStateToProps)(Evaluation);

const Feedback = ({ type, children }) =>
    <Form.Text className={`text-${type}`} children={children} />

const CorrectFeedback = () =>
    <Feedback type="success">
        <strong>Your formalization is correct</strong>
    </Feedback>

const ErrorFeedback = ({children}) =>
    <Feedback type="danger" className="text-warning">
        <strong>
            An error occured while validating your formalization:
        </strong>
        {children}
    </Feedback>

const msgDiscuss = ' Discuss your formalization with your peers or teachers.'

const FailedFeedback = () =>
    <Feedback type="warning">
        <strong>
            We were unable to automatically validate your formalization.
        </strong>
        {msgDiscuss}
    </Feedback>

const IncorrectFeedback = ({ summary, children }) =>
    <Feedback type="danger">
        <strong>Your formalization is incorrect.</strong>
        { !children
            ? <p>{summary}</p>
            : <details open>
                <summary className="mb-2">{summary}</summary>
                {children}
            </details>
        }
    </Feedback>

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

const getMessage = (evaluation) => {
  if (evaluation.solutionToFormalization === 'OK'
      && evaluation.formalizationToSolution === 'OK') {
    return (
        <CorrectFeedback/>
    );
  } else if (evaluation.solutionToFormalization === 'TE'
      || evaluation.formalizationToSolution === 'TE' || evaluation.solutionToFormalization === 'ME'
      || evaluation.formalizationToSolution === 'ME') {
    return (
        <FailedFeedback/>
    );
  } else {
    // FIXME: evaluation.languageContants is sometimes empty
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
            <IncorrectFeedback summary={
                `Your formalization is false
                in some first-order structure
                where the correct formalization is true.`
            }>
                <Counterexample
                    description="One such structure is"
                    structure={correctImpliesInput.counterexample}
                />
            </IncorrectFeedback>
        );
    } else if (inputImpliesCorrect.result === 'WA'
        && correctImpliesInput.result === 'OK') {
        return (
            <IncorrectFeedback summary={
                `Your formalization is true
                in some first-order structure
                where the correct formalization is false.`
            }>
                <Counterexample
                    description="One such structure is"
                    structure={inputImpliesCorrect.counterexample}
                />
            </IncorrectFeedback>
        );
    } else {
        return (
            <IncorrectFeedback
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
            </IncorrectFeedback>
        );
    }
  }
};

