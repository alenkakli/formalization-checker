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
import appComponentStyles from '../../AppComponent.module.scss';

export const SolveExercise = ({ exerciseId, exercise, status, error, fetchExercise, user, onChange, View = ExerciseView }) => {
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
            <View {...exercise}>
              { propositions_list }
            </View>
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

const ExerciseView = ({title, description, constants, predicates, functions, children}) => (
    <div>
        <h2>{ title }</h2>
        <p>{ description }</p>
        <h3 class="h5">Language ℒ</h3>
        <p>𝒞<sub>ℒ</sub> = {"{ "}{ constants }{" }"}</p>
        <p>𝒫<sub>ℒ</sub> = {"{ "}{ predicates }{" }"}</p>
        <p>ℱ<sub>ℒ</sub> = {"{ "}{ functions }{" }"}</p>
        { acceptedSymbolsView("") }
        <h3>Propositions</h3>
        { children }
    </div>
);

export const EmbeddedExerciseView = ({title, description, constants, predicates, functions, children}) => (
  <>
    <div className="px-3">
      <div className="float-end ms-3 mb-3">
        <span className="bi bi-info-circle-fill text-secondary" title={title}/>
      </div>
      <p>{ description }</p>
    </div>
    <div className={`bg-white px-3 pb-2 mb-2 border-bottom ${appComponentStyles.stickyHeader}`}>
      <details open className={appComponentStyles.language}>
      <summary className="fs-5"><h3 className="h5">Language ℒ</h3></summary>
      <p>𝒞<sub>ℒ</sub> = {"{ "}{ constants }{" }"}</p>
      <p>𝒫<sub>ℒ</sub> = {"{ "}{ predicates }{" }"}</p>
      <p>ℱ<sub>ℒ</sub> = {"{ "}{ functions }{" }"}</p>
      </details>
      { acceptedSymbolsView(`mb-0 ${appComponentStyles.syntaxHelp}`) }
    </div>
    <div className="px-3">
      <h3 className="h5">Propositions</h3>
      { children }
    </div>
  </>
);

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

const acceptedSymbolsView = (cls) => (
  <details className={cls}>
    <summary className="h6">Accepted notation of logical symbols</summary>
    <Table size="sm" striped className={`w-auto ${cls}`}>
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
