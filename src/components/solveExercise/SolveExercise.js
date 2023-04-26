import React, { useEffect } from 'react';
import { Spinner, Alert, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import Solution from './Solution';
import {
    selectExercise,
    selectStatus,
    selectError,
    fetchExercise
} from '../../redux/solveExerciseSlice';
import { useParams } from 'react-router';
import {selectUser} from "../../redux/userSlice";

export const SolveExercise = ({ exerciseId, exercise, status, error, fetchExercise, user, onChange }) => {
    useEffect(() => {
        if (status === 'idle') {
            fetchExercise({ exercise_id: exerciseId, username: user });
        }
    }, [status, exerciseId, exercise, fetchExercise, user]);

    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;
    } else if (status === 'succeeded') {
        const propositions_list = exercise.propositions.map((x) => (
            <Solution
              key={x.proposition_id}
              exercise_id={exerciseId}
              proposition_id={x.proposition_id}
              proposition={x.proposition}
              user={user}
              onChange={onChange}
            />
        ));
        content = (
            <div>
                <h2>{ exercise.title }</h2>
                <p>{ exercise.description }</p>
                <h5>Language ℒ</h5>
                <p>𝒞<sub>ℒ</sub> = {"{ "}{ exercise.constants }{" }"}</p>
                <p>𝒫<sub>ℒ</sub> = {"{ "}{ exercise.predicates }{" }"}</p>
                <p>ℱ<sub>ℒ</sub> = {"{ "}{ exercise.functions }{" }"}</p>
                { acceptedSymbolsView }
                <h5>Propositions</h5>
                { propositions_list }
            </div>
        );
    } else if (status === 'failed') {
        content = (
            <Alert variant="danger">
                {error}
            </Alert>
        );
    }

    return content;
}

function SolveExercise1(props) {
  const { id } = useParams();
  return <SolveExercise exerciseId={id} {...props} />
}

const acceptedSymbols = [
  {
    name: "Negation",
    preferredToken: "¬",
    acceptedTokens: [ "-", "!", "~", "\\neg", "\\lnot" ]
  },
  {
    name: "Equality",
    preferredToken: "≐",
    acceptedTokens: [ "=" ]
  },
  {
    name: "Inequality",
    preferredToken: "≠",
    acceptedTokens: [ "!=", "/=", "<>", "\\neq" ]
  },
  {
    name: "Conjunction",
    preferredToken: "∧",
    acceptedTokens: [ "&&", "&", "/\\", "\\wedge", "\\land" ]
  },
  {
    name: "Disjunction",
    preferredToken: "∨",
    acceptedTokens: [ "||", "|", "\\/", "\\vee", "\\lor", ]
  },
  {
    name: "Implication",
    preferredToken: "→",
    acceptedTokens: [ "->", "\\to" ]
  },
  {
    name: "Equivalence",
    preferredToken: "↔︎",
    acceptedTokens: [ "⟷", "<->", "<-->", "\\lequiv", "\\leftrightarrow" ]
  },
  {
    name: "Existential quantifier",
    preferredToken: "∃",
    acceptedTokens: [ "\\exists", "\\e", "\\E" ]
  },
  {
    name: "Universal quantifier",
    preferredToken: "∀",
    acceptedTokens: [ "\\forall", "\\a", "\\A" ]
  },
];

const acceptedSymbolsView = (
  <details className="mb-3">
    <summary className="h6">Accepted notation of logical symbols</summary>
    <Table size="sm" striped className="w-auto">
      <thead>
        <tr>
          <th>Logical symbol</th>
          <th>Accepted notation</th>
        </tr>
      </thead>
      <tbody>
        {
          acceptedSymbols.map(({ name, preferredToken, acceptedTokens }) =>
            <tr key={name}>
              <th>{name}</th>
              <td>
                <strong key={preferredToken}><code>{preferredToken}</code></strong>
                {
                  acceptedTokens.map( (token) =>
                    <React.Fragment key={token}>
                      {" "}<code className="ml-2">{token}</code>
                    </React.Fragment>
                  )
                }
              </td>
            </tr>
          )
        }
      </tbody>
    </Table>
  </details>
);

const mapStateToProps = (state) => {
    return {
        exercise: selectExercise(state),
        status: selectStatus(state),
        error: selectError(state),
        user: selectUser(state),
    };
};

const mapDispatchToProps = { fetchExercise };

export default connect(mapStateToProps, mapDispatchToProps)(SolveExercise1);
