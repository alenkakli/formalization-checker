import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Proposition from './Proposition';
import {
  addNewProposition,
  selectPropositions
} from '../../redux/addExerciseSlice';


function PropositionsSection({ propositions, add }) {
  const propositions_list = propositions.map((_x, i) => (
    <Proposition key={i} i={i} />
  ));

  return (
    <div className="mb-4 clearfix">
      <h4 className="mb-3">Propositions</h4>
      { propositions_list }
      <div>
        <Button
          variant="success"
          onClick={() => add()}
        >
          Add proposition
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    propositions: selectPropositions(state)
  };
};

const mapDispatchToProps = { add: addNewProposition };

export default connect(mapStateToProps, mapDispatchToProps)(PropositionsSection);
