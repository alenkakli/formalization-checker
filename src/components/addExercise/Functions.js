import React from 'react';
import SymbolsInput from './SymbolsInput';
import { connect } from 'react-redux';
import {
  updateFunctions,
  selectFunctionsParsed
} from '../../redux/addExerciseSlice';


const Functions = (props) =>
  <SymbolsInput
    symbolsKind="function symbols"
    symbolsSet="ℱ"
    {...props}
  />;

const mapStateToProps = selectFunctionsParsed;

const mapDispatchToProps = { update: updateFunctions };

export default connect(mapStateToProps, mapDispatchToProps)(Functions);
