import React from 'react';
import { Form } from 'react-bootstrap';


function SyntaxError({ value, error }) {
  if (!error) {
    return null;
  }

  const start = error.location.start.offset;
  const end = error.location.end.offset;

  const str_1 = value.substring(0, start);
  const str_2 = value.substring(start, end);
  const str_3 = value.substring(end);

  const str = value === "" ?
    null : (
      <div className="text-body">
        {str_1}
        <mark className="bg-warning">
          {str_2}
        </mark>
        {str_3}
      </div>
    );

  return (
    <Form.Control.Feedback type="invalid">
      {str}
      <div>
        {error.message}
      </div>
    </Form.Control.Feedback>
  );
}

export default SyntaxError;
