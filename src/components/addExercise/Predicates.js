import React from 'react';
import SymbolsInput from './SymbolsInput';
import { connect } from 'react-redux';
import {
  updatePredicates,
  selectPredicatesParsed
} from '../../redux/addExerciseSlice';


const Predicates = (props) =>
  <SymbolsInput
    symbolsKind="predicate symbols"
    symbolsSet="𝒫"
    {...props}
  />;

const mapStateToProps = selectPredicatesParsed;

const mapDispatchToProps = { update: updatePredicates };

export default connect(mapStateToProps, mapDispatchToProps)(Predicates);
