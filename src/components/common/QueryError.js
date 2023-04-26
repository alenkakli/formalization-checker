import React from 'react';
import { Alert } from 'react-bootstrap';

const QueryError = ({ error, as: Comp = Alert }) =>
    <Comp variant="danger">
        <strong>An error has occured while fetching the exercises list.</strong>
        {" "}
        { error.originalStatus == 200
        ? error.error
        : `Server responded with status ${error.originalStatus}.` }
    </Comp>;

export default QueryError;
