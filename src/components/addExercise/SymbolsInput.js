import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import SyntaxError from './SyntaxError';


function SymbolsInput({ symbolsKind, symbolsSet, value, error, update }) {  
  return (
    <InputGroup hasValidation={!!error} className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text as="label">
          {symbolsSet}<sub>ℒ</sub>{" = {"}
        </InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control
        type="text"
        placeholder={`Enter ${symbolsKind}`}
        value={value}
        onChange={(e) => update(e.target.value)}
        isInvalid={!!error}
      />
      <InputGroup.Append>
        <InputGroup.Text>{"}"}</InputGroup.Text>
      </InputGroup.Append>
      <SyntaxError value={value} error={error} />
    </InputGroup>
  );
}

export default SymbolsInput;
