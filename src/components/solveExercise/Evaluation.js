import React, {useEffect, useState} from 'react';
import {Form,Spinner, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
    selectEvalStatus,
    selectEvalError,
    fetchActiveFeedbacks,
    feedbackRating, selectEvaluation, selectFeedbacks
} from '../../redux/solveExerciseSlice';
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

const UnknownEvaluationResult = () =>
    <EvalResult type="warning">
        <strong>
            We were unable to automatically validate your formalization due to an unknown evaluation result.
        </strong>
        {msgDiscuss}
    </EvalResult>

const FailedStructureResult = () =>
    <EvalResult type="danger">
        <strong>
            Your formalization is incorrect, but we were unable to automatically find a structure.
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

const Structure = ({ subscript, domain, iC, iP, iF }) => (<>
    <p className="mb-1">
        𝐷{subscript}{` = {${domain.join(", ")}}`}
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

const CollapsibleStructure = ({ subscript, structure }) => (
    <details className="mt-2">
        <summary className="mb-2">Structure ℳ{subscript}</summary>
        <Structure subscript={subscript} {...structure} />
    </details>
);

const Traces = ({ traces }) => {
    if (!traces) return null;
    return (
        <div>
            {traces}
        </div>
    );
};


const Counterexample = ({ structure, description, index, msgNotFound, traceData, antecedentLabel, consequentLabel }) => {
    if (!structure || !traceData) {
        return (
            <p className="mb-2">
                {msgNotFound ?? "We could not find a counterexample automatically."}
                {msgDiscuss}
            </p>
        );
    }

    const subscript = index ? <sub>{index}</sub> : null;
    const traces = makeTraces(traceData, structure.structureConstants, antecedentLabel, consequentLabel);

    return traces ? (
        <div className="mb-2">
            <p className="mb-1">
                {description}{" "}
                ℳ{subscript} = (𝐷{subscript}, 𝑖{subscript}):
            </p>
            <Traces 
                traces={traces} 
                />
            <CollapsibleStructure
                subscript={subscript}
                structure={structure}
            />
        </div>
    ) : (
        <p className="mb-2">
            {msgNotFound ?? "We could not find a counterexample automatically."}
            {msgDiscuss}
        </p>
    );
};

const getLanguageDifferences = (languageDiff) => {
    const nonEmptyDifferences = Object.entries(languageDiff)
        .map(([key, { missing, extra }]) => {
            const differenceParts = [];

            if (missing.length > 0) {
                differenceParts.push(
                    <li key={`${key}-missing`}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)} missing:</strong> {missing.join(", ")}
                    </li>
                );
            }

            if (extra.length > 0) {
                differenceParts.push(
                    <li key={`${key}-extra`}>
                        <strong>Extra {key.slice(0)}:</strong> {extra.join(", ")}
                    </li>
                );
            }

            return differenceParts.length > 0 ? differenceParts : null;
        })
        .flat();

    return nonEmptyDifferences.length > 0 ? <ul>{nonEmptyDifferences}</ul> : <p>No missing or extra symbols found.</p>;
};

const renderEvaluation = (structureConstants, evalObj, seenEvaluations = new Set()) => {
    const evaluationString = JSON.stringify(evalObj);

    if (seenEvaluations.has(evaluationString)) {
        return;
    }
    seenEvaluations.add(evaluationString);

    switch (evalObj.kind) {
        case "quant":
        case "universalQuant":
        case "existentialQuant":
            return (
                <div className="quant-block">
                    {evalObj.args.map((arg, index) => (
                        <div key={index} className="connective-block">
                            {renderEvaluation(structureConstants, arg, seenEvaluations)}
                        </div>
                    ))}
                </div>
            );
        
        case "connective":
        case "conjunction":
        case "disjunction":
        case "implication":
        case "equivalence":
        case "negation":
            return (
                <span className="connective-inline">
                    {evalObj.args.map((arg, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && " ∧ "}
                            {renderEvaluation(structureConstants, arg)}
                        </React.Fragment>
                    ))}
                </span>
            );
            
        case "equality":
            const left = renderEvaluation(structureConstants, evalObj.args[0], seenEvaluations);
            const right = renderEvaluation(structureConstants, evalObj.args[1], seenEvaluations);

            let equalityString = evalObj.args[0].kind === "constant" ? `${evalObj.args[0].symbol}` : `${structureConstants[evalObj.args[0].result - 1]}`;
            equalityString += ` ${evalObj.result ? "=" : "≠"} `;
            equalityString += "" + evalObj.args[1].kind === "constant" ? `${evalObj.args[1].symbol}` : `${structureConstants[evalObj.args[1].result - 1]}`;

            return  <span>
                        {left}{left && " ∧ "}{right}{right && " ∧ "}{equalityString}
                    </span>;

        case "predicate":
            let predicateFunc;
            const predicateString = `${evalObj.symbol}(${evalObj.args.map(arg => {
                    if (arg.kind === "functionApplication") {
                        predicateFunc = <span>{predicateFunc} {renderEvaluation(structureConstants, arg, seenEvaluations)} ∧ </span>;
                    }
                    return (arg.kind === "variable" || arg.kind === "functionApplication")
                        ? structureConstants[arg.result - 1] 
                        : arg.symbol;
                }).join(", ")})`;
            
            return  <span>
                        {predicateFunc} {evalObj.result ? predicateString : `¬${predicateString}`}
                    </span>;
        
        case "functionApplication":
            let functionFunc;
            const functionString = `${evalObj.symbol}(${evalObj.args.map(arg => {
                if (arg.kind === "functionApplication") {
                    functionFunc = <span>{functionFunc} {renderEvaluation(structureConstants, arg, seenEvaluations)} ∧ </span>;
                }
                return (arg.kind === "variable" || arg.kind === "functionApplication")
                    ? structureConstants[arg.result - 1] 
                    : arg.symbol;
            }).join(", ")}) = ${structureConstants[evalObj.result - 1]}`;
            
            return  <span>
                        {functionFunc} {functionString}
                    </span>;

        case "variable":
        case "constant":
            return  null;

        default:
            return null;
    }
};

const makeTraces = (traces, structureConstants, antecedentLabel = 'Antecedent', consequentLabel = 'Consequent') => {
    if (!traces?.antecedent || !traces?.consequent || !structureConstants) return;

    const fmbValues = structureConstants.filter(item => item.startsWith("$"));

    let tracePrologue = `∀x ( ${structureConstants.map(value => `x = ${value} `).join(" ∨ ")} )`;
    if (fmbValues.length > 0) {
        tracePrologue = `${fmbValues.map(fmb => `∃${fmb}`).join(" ")}: ${tracePrologue} `;
    }

    const inequalities = [];
    const minInequalities = Math.min(structureConstants.length, 3);
    for (let i = 0; i < minInequalities; i++) {
        for (let j = i + 1; j < minInequalities; j++) {
            inequalities.push(`${structureConstants[i]} ≠ ${structureConstants[j]}`);
        }
    }
    if (inequalities.length > 0) {
        tracePrologue += ` ∧ ( ${inequalities.join(" ∧ ")} ${structureConstants.length > 3 ? "∧ ..." : ""} ):`;
    }

    return (
        <ul>
            <li>
            <details className="mb-3" open>
                <summary><b>{antecedentLabel}</b> formalization is <b>{traces.antecedent.result.toString()}</b> because</summary>
                <div className="traceDetails">
                    <p className="mb-0">{tracePrologue}</p>
                    <div className="student-trace">
                        {renderEvaluation(structureConstants, traces.antecedent)}
                    </div>
                </div>
            </details>
            </li>
            <li>
            <details className="mb-3" open>
                <summary><b>{consequentLabel}</b> formalization is <b>{traces.consequent.result.toString()}</b> because</summary>
                <div className="traceDetails">
                    <p className="mb-0">{tracePrologue}</p>
                    <div className="solution-trace">
                        {renderEvaluation(structureConstants, traces.consequent)}
                    </div>
                </div>
            </details>
            </li>
        </ul>
    );
};


const viewEvalResult = (evaluation) => {
    if (evaluation.inputImpliesCorrect.result === "missingOrExtraSymbols" &&
        evaluation.correctImpliesInput.result === "missingOrExtraSymbols") {
        return (
            <IncorrectEvalResult summary="Your formalization is incorrect due to missing or extra symbols.">
                {getLanguageDifferences(evaluation.languageDiff)}
            </IncorrectEvalResult>
        );
    }

    if (evaluation.inputImpliesCorrect.result === 'OK'
        && evaluation.correctImpliesInput.result === 'OK') {
        return <CorrectEvalResult />;
    }

    if (evaluation.inputImpliesCorrect.result === 'TE'
        || evaluation.correctImpliesInput.result === 'TE'
        || evaluation.inputImpliesCorrect.result === 'ML'
        || evaluation.correctImpliesInput.result === 'ML') {
        return <FailedEvalResult />;
    }

    if ( (evaluation.inputImpliesCorrect.result !== 'OK' && evaluation.inputImpliesCorrect.result !== 'WA') ||
        (evaluation.correctImpliesInput.result !== 'OK' && evaluation.correctImpliesInput.result !== 'WA') ) {
            return <UnknownEvaluationResult />;
    }

    // FIXME: evaluation.languageConstants is sometimes empty
    // Example: Charles hates no one whom Agatha hates.
    // \a x(-hates(C,x) \limpl -hates(C,x))
    // FIXME: 1.5.1. Peter je muž. A = E.
    // No counterexample in one direction, in the other direction:
    // got i(muz) = {}; should get: i(muz) = {i(Peter)}
    // const C_L = new Set(evaluation.languageContants);
    // TODO: Fix backend to return a pair of objects similar to these

    const correctImpliesInput = evaluation.correctImpliesInput;
    const inputImpliesCorrect = evaluation.inputImpliesCorrect;

    if (inputImpliesCorrect.result === 'OK'
        && correctImpliesInput.result === 'WA') {
        return (
            <IncorrectEvalResult summary={
                `Your formalization is false
                in some first-order structure
                where the correct formalization is true.`
            }>
                {
                    (correctImpliesInput.counterexample && !correctImpliesInput.counterexample.error)
                    ? <Counterexample
                        description="In such structure"
                        structure={correctImpliesInput.counterexample}
                        traceData={correctImpliesInput.traces}
                        antecedentLabel={'The correct'}
                        consequentLabel={'Your'}
                        />
                    : <FailedStructureResult error={correctImpliesInput.counterexample?.error} />
                }
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
                {
                    (inputImpliesCorrect.counterexample && !inputImpliesCorrect.counterexample.error)
                    ? <Counterexample
                        description="In such structure"
                        structure={inputImpliesCorrect.counterexample}
                        traceData={inputImpliesCorrect.traces}
                        antecedentLabel={'Your'}
                        consequentLabel={'The correct'}
                        />
                    : <FailedStructureResult error={inputImpliesCorrect.counterexample?.error} />
                }
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
            {
                (inputImpliesCorrect.counterexample && !inputImpliesCorrect.counterexample.error)
                ? <Counterexample
                    description="In structure"
                    structure={inputImpliesCorrect.counterexample}
                    traceData={inputImpliesCorrect.traces}
                    antecedentLabel={'Your'}
                    consequentLabel={'The correct'}
                    index={1}
                    msgNotFound={`We could not automatically find a structure
                                in which your formalization is true
                                and the correct formalization is false.`}
                    />
                : <FailedStructureResult error={inputImpliesCorrect.counterexample?.error} />
            }
            {
                (correctImpliesInput.counterexample && !correctImpliesInput.counterexample.error)
                ? <Counterexample
                    description="In structure"
                    structure={correctImpliesInput.counterexample}
                    traceData={correctImpliesInput.traces}
                    antecedentLabel={'The correct'}
                    consequentLabel={'Your'}
                    index={2}
                    msgNotFound={`We could not automatically find a structure
                        in which your formalization is false
                        and the correct formalization is true.`}
                    />
                    : <FailedStructureResult error={correctImpliesInput.counterexample?.error} />
            }
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
            variant="info"
            size="sm"
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
