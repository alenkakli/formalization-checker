import React from 'react';
import SymbolsInput from './SymbolsInput';
import { connect } from 'react-redux';
import {
  updateConstants,
  selectConstantsParsed
} from '../../redux/addExerciseSlice';


const Constants = (props) =>
  <SymbolsInput
    symbolsKind="individual constants"
    symbolsSet="𝒞"
    {...props}
  />;

const mapStateToProps = selectConstantsParsed;

const mapDispatchToProps = { update: updateConstants };

export default connect(mapStateToProps, mapDispatchToProps)(Constants);
