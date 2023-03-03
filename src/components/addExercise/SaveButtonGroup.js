import React from 'react';
import { Form, Button } from 'react-bootstrap';

function SaveButtonGroup({ containsErrors, saveExercise}) {
  return (
    <Form.Group className="text-center text-md-right mb-4">
      <Button
          variant="primary"
          size="lg"
          disabled={containsErrors}
          onClick={saveExercise}
      >
          Save exercise
      </Button>
      {containsErrors &&
        <Form.Text className="text-danger">
          Fix all errors above
          in order to be able to save the exercise
        </Form.Text>
      }
    </Form.Group>
  );
}

export default SaveButtonGroup;
