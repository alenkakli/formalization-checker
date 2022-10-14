import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  selectEvaluation,
  selectEvalStatus,
  selectEvalError
} from '../../redux/solveExerciseSlice';
import {
    getStringDomainAndPredicates,
} from '../../redux/helpers';


function Evaluation({ evaluation, status, error }) {
  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    content = getMessage(evaluation);
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
    status: selectEvalStatus(state, ownProps.proposition_id),
    error: selectEvalError(state, ownProps.proposition_id)
  };
};

export default connect(mapStateToProps)(Evaluation);


const getMessage = (evaluation) => {
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

      if (evaluation.solutionToFormalization === 'OK'
          && evaluation.formalizationToSolution === 'WA') {
          if (evaluation.iFormalizationSolution !== 'null') {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Vieme nájsť konkrétnu štruktúru,
                          v ktorej je hľadaná správna formalizácia pravdivá,
                          ale vaša formalizácia je nepravdivá.</p>

                      <p>{evaluation.m1}</p>
                      <p>{domainFormToSol}</p>
                      {symbolsFormToSol.split("\n").map((i,key) => {
                          return <div className="p" key={key}>{i}</div>;
                      })}


                      <br/>


                  </Alert>
              );
          } else {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Nepodarilo sa nájsť štruktúru, na vaše riešenie sa radšej opýtajte.</p>

                  </Alert>
              );
          }
      } else if (evaluation.solutionToFormalization === 'WA'
          && evaluation.formalizationToSolution === 'OK') {
          if (evaluation.iSolutionToFormalization !== 'null') {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Vieme nájsť konkrétnu štruktúru,
                          v ktorej je vaša formalizácia pravdivá,
                          ale hľadaná správna formalizácia je nepravdivá.</p>
                      <p>{evaluation.m2}</p>
                      <p>{domainSolToForm}</p>
                      {symbolsSolToForm.split("\n").map((i,key) => {
                          return <div className="p" key={key}>{i}</div>;
                      })}

                  </Alert>
              );
          } else {
              return (
                  <Alert variant="danger">
                      <b>Riešenie je nesprávne.</b>
                      <p>Nepodarilo sa nájsť štruktúru, na vaše riešenie sa radšej opýtajte.</p>
                  </Alert>
              );
          }
      } else {
          return (
              <Alert variant="danger">
                  <b>Riešenie je nesprávne.</b>
                  <p>Vieme nájsť konkrétne štruktúry,
                      v ktorých je vaša formalizácia pravdivá,
                      ale hľadaná správna formalizácia je nepravdivá, a naopak.</p>

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


              </Alert>
          );
      }

  }
};

