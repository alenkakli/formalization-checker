import React from 'react';
import Constants from './Constants';
import Predicates from './Predicates';
import Functions from './Functions';
import Clashes from './Clashes';
import Constraint from './Constraint';


function LanguageSection() {
  return (
    <div className="mt-4 mb-4">
      <h4>Language</h4>
      <Constants />
      <Predicates />
      <Functions />
      <Clashes />
      <Constraint/>
    </div>
  );
}

export default LanguageSection;
